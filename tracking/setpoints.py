
def init(video_capture):
	import cv2
	import numpy

	print("Adjusting")

	points = []

	while True:
		ret, frame = (video_capture.read())

		cv2.line(frame, (0, 0), (150, 150), (255, 255, 255), 15)

		cv2.imshow("Adjust", frame)

		# Interupt if we catch a key press
		if cv2.waitKey(1) != -1:
			raise KeyboardInterrupt()
