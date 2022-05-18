import json


class PongGameInterface:
    def __init__(self):
        self.state = {
            'ball_pos': [0, 0],
            'my_pos': 0,
            'mov': 0
        }

    def _request_update(self):
        self.state = json.loads(input())

    def _send_update(self):
        print(json.dumps(self.state))

    def get_my_position(self):
        return self.state['my_pos']

    def get_ball_position(self):
        return self.state['my_pos']

    def set_movement(self, dir):
        if dir != -1 and dir != 0 and dir != 1:
            raise Exception()
        self.state['mov'] = dir
