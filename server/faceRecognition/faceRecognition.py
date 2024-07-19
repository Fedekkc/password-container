import cv2
import numpy as np

class FaceRecognition:
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
    def detect_face(self, image):
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) 
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        return faces

    def draw_rectangle(self, image, faces):
        for (x, y, w, h) in faces:
            cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)

    def crop_face(self, image, faces):
        cropped_faces = []
        for (x, y, w, h) in faces:
            cropped_faces.append(image[y:y+h, x:x+w])
        return cropped_faces

    def get_face(self, image):
        faces = self.detect_face(image)
        self.draw_rectangle(image, faces)
        return self.crop_face(image, faces)
    
    def save_face(self, image, faces):
        for i, face in enumerate(faces):
            cv2.imwrite("face_{}.jpg".format(i), face)
            print("Face saved as face_{}.jpg".format(i))

    def get_face_from_image(self, image_path):
        image = cv2.imread(image_path)
        return self.get_face(image)
    
    def get_face_from_video(self, video_path):
        cap = cv2.VideoCapture(0) 
        while True:
            ret, frame = cap.read()
            print("Frame read")
            faces = self.get_face(frame)
            if not ret:
                print("Can't receive frame (stream end?). Exiting ...")
                break
            print("Frame read")
            self.save_face(frame, faces)
            cv2.imshow('frame', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        cap.release()
        cv2.destroyAllWindows()

        def compare_faces(self, face1: np.ndarray, face2: np.ndarray):
            if face1.shape == face2.shape:
                difference = cv2.subtract(face1, face2)
                result = not np.any(difference)
                if result:
                    print("The faces are the same")
                else:
                    print("The faces are different")

# Test
face_recognition = FaceRecognition()
face_recognition.get_face_from_image("face.jpg")
face_recognition.get_face_from_video("video.mp4")

# Output
# Face saved as face_0.jpg
# Face saved as face_1.jpg