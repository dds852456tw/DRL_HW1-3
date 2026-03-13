import numpy as np
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

class ValueIterationGrid:
    def __init__(self, rows, cols, start, target, walls, gamma=0.9, step_reward=-0.1, target_reward=100.0):
        self.rows = rows
        self.cols = cols
        self.start = tuple(start)
        self.target = tuple(target)
        self.walls = set(tuple(w) for w in walls)
        self.gamma = gamma
        self.step_reward = step_reward
        self.target_reward = target_reward
        
        # Initialize Value function
        self.V = np.zeros((rows, cols))
        # Optimal policy: 0: Up, 1: Down, 2: Left, 3: Right
        self.policy = np.zeros((rows, cols), dtype=int)
        
        self.actions = [(-1, 0), (1, 0), (0, -1), (0, 1)] # Up, Down, Left, Right
        self.action_names = ['UP', 'DOWN', 'LEFT', 'RIGHT']

    def is_valid(self, r, c):
        return 0 <= r < self.rows and 0 <= c < self.cols and (r, c) not in self.walls

    def solve(self, iterations=100, theta=1e-4):
        for _ in range(iterations):
            delta = 0
            new_V = self.V.copy()
            for r in range(self.rows):
                for c in range(self.cols):
                    if (r, c) == self.target or (r, c) in self.walls:
                        continue
                    
                    v = self.V[r, c]
                    action_values = []
                    for action in self.actions:
                        nr, nc = r + action[0], c + action[1]
                        
                        if not self.is_valid(nr, nc):
                            # Stay in place if invalid or hit wall
                            nr, nc = r, c
                        
                        reward = self.target_reward if (nr, nc) == self.target else self.step_reward
                        # If we stay in place due to hitting a wall, the reward is still step_reward
                        # unless the cell we hit WAS the target (not possible for walls)
                        
                        val = reward + self.gamma * self.V[nr, nc]
                        action_values.append(val)
                    
                    new_V[r, c] = max(action_values)
                    delta = max(delta, abs(v - new_V[r, c]))
            
            self.V = new_V
            if delta < theta:
                break
        
        # Determine optimal policy
        for r in range(self.rows):
            for c in range(self.cols):
                if (r, c) == self.target or (r, c) in self.walls:
                    continue
                
                action_values = []
                for action in self.actions:
                    nr, nc = r + action[0], c + action[1]
                    if not self.is_valid(nr, nc):
                        nr, nc = r, c
                    reward = self.target_reward if (nr, nc) == self.target else self.step_reward
                    val = reward + self.gamma * self.V[nr, nc]
                    action_values.append(val)
                
                self.policy[r, c] = np.argmax(action_values)

    def get_results(self):
        return {
            'v_function': self.V.tolist(),
            'policy': self.policy.tolist(),
            'rows': self.rows,
            'cols': self.cols
        }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/solve', methods=['POST'])
def solve():
    data = request.json
    rows = data.get('rows', 5)
    cols = data.get('cols', 5)
    start = data.get('start', [0, 0])
    target = data.get('target', [rows-1, cols-1])
    walls = data.get('walls', [])
    gamma = float(data.get('gamma', 0.9))
    
    vi = ValueIterationGrid(rows, cols, start, target, walls, gamma=gamma)
    vi.solve()
    return jsonify(vi.get_results())

if __name__ == '__main__':
    app.run(debug=True, port=5000)
