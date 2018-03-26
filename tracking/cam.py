# Import required modules
import cv2
import numpy
import time
import random

# The contour of a tracker marker should be at least this long
min_contour_length = 24

# The width of the webcam frame
width = 640
# The height of the webcam frame
height = 480

# Start video camera on webcam
video_capture = cv2.VideoCapture(0)
# The ball data container
ball = {"x": 200.0, "y": 150.0, "d": {"x": 0.0, "y": 0.0}}
# The default colors in the debug window
displayColors = [[(0, 0, 255), (50, 50, 200)], [(0, 255, 0), (50, 200, 50)]]

try:
	while True:
		# Capture a frame
		ret, frame = (video_capture.read())

		pts1 = numpy.float32([[200,65],[368,52],[28,387],[389,390]])
		pts2 = numpy.float32([[0, 0], [width, 0], [0, height], [width, height]])

		M = cv2.getPerspectiveTransform(pts1, pts2)

		# frame = cv2.warpPerspective(frame, M, (width, height))

		# Convert the frame to HSV
		col = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

		# The lower HSV value
		lower_blue = numpy.array([110,50,50])
		# The upper HSV value
		upper_blue = numpy.array([130,255,255])

		# Create a mask of only the blue elements
		mask = cv2.inRange(col, lower_blue, upper_blue)

		# Get the contours of the blue areas
		im2, contours, hierarchy = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

		# Filter out the really small coutours
		contours = [contour for contour in contours if len(contour) > min_contour_length]

		# Will contain the biggest contour for both left and right
		cont_wins = [[], []]
		cont_sizes = [-1, -1]

		# Loop through all contours
		for contour in contours:
			area = cv2.contourArea(contour)

			# Check if this is a viable canidate
			if area > cont_sizes[0] or area > cont_sizes[1]:
				# Get the contour moments
				M = cv2.moments(contour)

				# Calculate the XY cords of the centre
				cX = int(M["m10"] / M["m00"])
				cY = int(M["m01"] / M["m00"])

				# Determain if it's a left or a right point
				if cX > width / 2:
					index = 1
				else:
					index = 0

				# Draw a circle in the right color
				cv2.circle(frame, (cX, cY), 7, displayColors[index][0], -1)

				# If it's the biggest yet for this side, save it
				if area > cont_sizes[index]:
					cont_wins[index] = [contour, {"x": cX, "y": cY}]
					cont_sizes[index] = area

		# Draw the left marker and contour
		if len(cont_wins[0]) > 0:
			cv2.drawContours(frame, [cont_wins[0][0]], -1, displayColors[0][1], 3)
			cv2.circle(frame, (cont_wins[0][1]["x"], cont_wins[0][1]["y"]), 4, (255, 255, 255), -1)


		# Draw the right marker and contour
		if len(cont_wins[1]) > 0:
			cv2.drawContours(frame, [cont_wins[1][0]], -1, displayColors[1][1], 3)
			cv2.circle(frame, (cont_wins[1][1]["x"], cont_wins[1][1]["y"]), 4, (255, 255, 255), -1)

		# Show the image in a window
		cv2.imshow("Veld cam", frame)

		# Create an empty black image
		fpong = numpy.zeros((300, 400, 3), numpy.uint8)
		# Set the cords to off screen by default
		fcord = {"left": -60, "right": -60}

		# Set the relative opsition of the points if they exist
		if len(cont_wins[0]) > 0:
			fcord["left"] = int(cont_wins[0][1]["y"] / height * 300)
		if len(cont_wins[1]) > 0:
			fcord["right"] = int(cont_wins[1][1]["y"] / height * 300)

		# Draw the left bat
		cv2.rectangle(fpong, (5, fcord["left"] + 20), (15, fcord["left"] - 20), (255, 255, 255), cv2.FILLED)
		# Draw the right bat
		cv2.rectangle(fpong, (395, fcord["right"] + 20), (385, fcord["right"] - 20), (255, 255, 255), cv2.FILLED)

		# Start the dashes off screen
		dash_height = -6

		# Draw the dashes
		while dash_height <= 300:
			cv2.rectangle(fpong, (195, dash_height), (205, dash_height + 10), (255, 255, 255), cv2.FILLED)
			dash_height += 20

		l_file = open("vars/left_y", "w")
		l_file.write(str(fcord["left"]))
		r_file = open("vars/right_y", "w")
		r_file.write(str(fcord["right"]))

		# Show the game screen
		cv2.imshow("Game", fpong)

		# Interupt if we catch a key press
		if cv2.waitKey(1) != -1:
			raise KeyboardInterrupt()


# On ctrl+C
except KeyboardInterrupt:
	# Let the user know we're stopping
	print("\nClosing window")

	# Release handle to the webcam
	video_capture.release()
	cv2.destroyAllWindows()
