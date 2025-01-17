from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
import threading
import time

from .constants import ALLOWED_BOUND_X_AXIS, ALLOWED_BOUND_Y_AXIS




class Singleton(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class Camera(metaclass = Singleton):

    
    def __init__(self):
        self.target_position = [0,0]
        self.current_position = [0,0]
        self.is_focussed = True
        self.thread = threading.Thread(target=self.handle_camera)
        self.thread.start()
    
    def handle_camera(self):
        while True:
            if self.target_position[0] == self.current_position[0] and self.target_position[1] == self.current_position[1]:
                if not self.is_focussed:
                    self.focus()
            if self.target_position[0] != self.current_position[0]:
                difference = self.target_position[0] - self.current_position[0]
                self.move('x', difference)
                self.current_position[0] += difference
            if self.target_position[1] != self.current_position[1]:
                difference = self.target_position[1] - self.current_position[1]
                self.move('y', difference)
                self.current_position[1] += difference
    
    def move(self, direction,units):
        self.is_focussed = False
        time.sleep(3*((abs(units))**(0.5)))
        
    def focus(self):
        time.sleep(2)
        self.is_focussed = True
    


class MovementAPI(APIView):

    
    def post(self, request):
        data = request.data
        camera = Camera()
        try:
            
            if camera.target_position[0] + data['x'] > ALLOWED_BOUND_X_AXIS or camera.target_position[0] + data['x'] < -ALLOWED_BOUND_X_AXIS:
                return Response({'status': 'error', 'message': 'x is out of bounds'},status=HTTP_400_BAD_REQUEST)
            if camera.target_position[1] + data['y'] > ALLOWED_BOUND_Y_AXIS or camera.target_position[1] + data['y'] < -ALLOWED_BOUND_Y_AXIS:
                return Response({'status': 'error', 'message': 'y is out of bounds'},status=HTTP_400_BAD_REQUEST)
            
            camera.target_position[0] += data['x']
            camera.target_position[1] += data['y']
            
        except KeyError:
            return Response({'status': 'error', 'message': 'x and y are required'},status=HTTP_400_BAD_REQUEST)
        return Response({'status': 'ok', 'current_position': camera.target_position},status=HTTP_200_OK)
    
    
    def get(self, request):
        camera = Camera()
        color = 'green'
        if camera.is_focussed:
            color = 'red'
        return Response({'status': 'ok', 'current_position': camera.current_position, 'color':color},status=HTTP_200_OK)
