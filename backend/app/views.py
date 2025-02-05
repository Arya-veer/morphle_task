from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
import threading
import time

N_ROWS = 10
N_COLS = 10



class Singleton(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class Camera(metaclass = Singleton):

    
    def __init__(self):
        self.target_position = [N_ROWS//2,N_COLS//2]
        self.current_position = [N_ROWS//2,N_COLS//2]
        self.is_focussed = True
        self.is_reset = False
        self.thread = threading.Thread(target=self.handle_camera)
        self.thread.start()
    
    def handle_camera(self):
        while not self.is_reset:
            if self.target_position == self.current_position:
                if not self.is_focussed:
                    self.focus()
            if self.target_position != self.current_position:
                difference_x,difference_y = self.target_position[0] - self.current_position[0], self.target_position[1] - self.current_position[1]
                self.move('x', abs(difference_x) + abs(difference_y))
                self.current_position = [self.current_position[0] + difference_x, self.current_position[1] + difference_y]
    
    def move(self, direction,units):
        self.is_focussed = False
        time.sleep(3*((abs(units))**(0.5)))
        
        
    def focus(self):
        time.sleep(2)
        self.is_focussed = True

        
    def reset(self):
        print('resetting')
        self.is_reset = True
        self.thread.join()
        self.target_position = [N_ROWS//2,N_COLS//2]
        self.current_position = [N_ROWS//2,N_COLS//2]
        self.is_focussed = True
        self.is_reset = False
        self.thread = threading.Thread(target=self.handle_camera)
        self.thread.start()
        print('resetted')
        

class BoardSettingsAPI(APIView):
    
    def get(self, request):
        return Response({'status': 'ok', 'rows':N_ROWS, 'cols':N_COLS},status=HTTP_200_OK)


class ResetCameraAPI(APIView):
    
    def post(self, request):
        try:
            camera = Camera()
            camera.reset()
            return Response({'status': 'ok', 'current_position': camera.current_position, 'color':'white'},status=HTTP_200_OK)
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)},status=HTTP_400_BAD_REQUEST)

class MovementAPI(APIView):

    
    def post(self, request):
        data = request.data
        camera = Camera()
        try:
            
            if camera.target_position[0] + data['x'] >= N_ROWS or camera.target_position[0] + data['x'] < 0:
                return Response({'status': 'error', 'message': 'x is out of bounds'},status=HTTP_400_BAD_REQUEST)
            if camera.target_position[1] + data['y'] >= N_COLS or camera.target_position[1] + data['y'] < 0:
                return Response({'status': 'error', 'message': 'y is out of bounds'},status=HTTP_400_BAD_REQUEST)
            camera.is_reset = False
            camera.target_position[0] += data['x']
            camera.target_position[1] += data['y']
            
        except KeyError:
            return Response({'status': 'error', 'message': 'x and y are required'},status=HTTP_400_BAD_REQUEST)
        return Response({'status': 'ok', 'current_position': camera.target_position},status=HTTP_200_OK)
    
    
    def get(self, request):
        camera = Camera()
        color = 'white'
        if camera.current_position != camera.target_position:
            color = 'orange'
        elif camera.is_focussed:
            color = 'red'
        else:
            color = 'green'
        return Response({'status': 'ok', 'current_position': camera.current_position, 'color':color},status=HTTP_200_OK)
