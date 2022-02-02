"""
OCW Listener
Listens for off-chain worker notifications on port 3005.
"""

from flask import Flask, request, jsonify
from flask_cors import cross_origin

app = Flask(__name__)

@app.route('/', methods=['POST'])
@cross_origin()
def main():
    if request.method == 'POST':
        record = request.data
        print(record)
        return jsonify({'status': "acknowledged"})


if __name__ == '__main__':
    # When changing the port, don't forget to change the port in the product-tracking pallet.
    app.run(host="localhost", port=3005, debug=True)
