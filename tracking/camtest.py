import cv2
import numpy
import time

min_contour_length = 48

video_capture = cv2.VideoCapture(0)

last_frame = time.time()

try:
	while True:
		ret, frame = (video_capture.read())

		col = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

		lower_blue = numpy.array([110,50,50])
		upper_blue = numpy.array([130,255,255])


		mask = cv2.inRange(col, lower_blue, upper_blue)

		im2, contours, hierarchy = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)


		contours = [contour for contour in contours if len(contour) > min_contour_length]

		cont_win = []
		cont_win_size = 0

		for contour in contours:
			area = cv2.contourArea(contour)

			if area > cont_win_size:
				M = cv2.moments(contour)
				cX = int(M["m10"] / M["m00"])
				cY = int(M["m01"] / M["m00"])

				cv2.circle(frame, (cX, cY), 7, (0, 0, 255), -1)
				cont_win = contour
				cont_win_size = area

		if len(cont_win) > 0:
			cv2.drawContours(frame, [cont_win], -1, (0,255,0), 3)


		alpha = 0.6
		# cv2.addWeighted(thresh, alpha, frame, 1 - alpha, 0, frame)

		# Show the image in a window
		cv2.imshow("Veld cam", frame)



		if cv2.waitKey(1) != -1:
			raise KeyboardInterrupt()




# On ctrl+C
except KeyboardInterrupt:
	# Let the user know we're stopping
	print("\nClosing window")

	# Release handle to the webcam
	video_capture.release()
	cv2.destroyAllWindows()
