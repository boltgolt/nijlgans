# Import required modules
import cv2
import numpy
import time

# The contour of a tracker marker should be at least this long
min_contour_length = 48

# The width of the frame
width = 640

# Start video camera on webcam
video_capture = cv2.VideoCapture(2)

displayColors = [[(0, 0, 255), (50, 50, 200)], [(0, 255, 0), (50, 200, 50)]]

try:
	while True:
		# Capture a frame
		ret, frame = (video_capture.read())

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

		# blank_image = np.zeros((height,width,3), np.uint8)

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
