from flask import Flask, abort, render_template, url_for, redirect, request, jsonify, Response, make_response
import logging
#logging.basicConfig(level=logging.INFO)
from dotenv import load_dotenv
load_dotenv()
from utils import user_data
import json


app = Flask(__name__)

@app.route('/',methods = ['POST', 'GET'])
def main():
    return render_template('index.html')

@app.route('/message',methods = ['POST', 'GET'])
def message():
    if request.method == 'POST':
        numbers = request.form['to']
        li = list(numbers.split('"'))
        for number in li:
            if len(number) <= 2:
                continue
            user = user_data()

            message = user.messages \
                .create(
                    body= request.form['txt_body'],
                    status_callback='http://541869c6530c.ngrok.io/update_status',
                    from_='+18062166833',
                    to=number
                )
            
    return 'Message sent succesfully'

@app.route('/update_status', methods=['POST', 'GET'])
def update_status():
    
    if request.method == 'POST':
        
        data = request.form['MessageStatus']
        print(data) 
        with open('data.txt', "w") as status:
            status.write(data)
        return data
    

@app.route('/update',methods = ['POST', 'GET'])
def update():
    with open('data.txt') as status:
           contents =  status.read()
           return jsonify({'data': contents})


'''

@app.route('/status', methods=['POST', 'GET'])
def status():
    data = request.form
    print(data['MessageStatus'])
    return render_template(index.html, data = data)
    return jsonify(render_template(index.html, data = data))
    return jsonify( data = data)


@app.route('/AllMessages/<id>')
def AllMessages(id):
    if request.method == 'POST':
        messages = user_data()
        allMsgs = messages.messages.stream()
        status = request.values.get('MessageStatus', None)
        return render_template('status_model.html', data = status)


@app.route("/status", methods=['POST', 'GET'])
def MessageStatus():
    message_sid = request.values.get('MessageSid', None)
    message_status = request.values.get('MessageStatus', None)
    #logging.info('SID: {}, Status: {}'.format(message_sid, message_status))
    
    return redirect(url_for('update', id = message_sid, stat = message_status))


@app.route('/update/<id>/<stat>',methods = ['POST', 'GET'])
def update(id, stat):
   return f'Message sending to: {id} saying: {stat}' 






@app.route('/success/<number>/<message_body>',methods = ['POST', 'GET'])
def success(number, message_body):
   return f'Message sending to: {number} saying: {message_body}' 

'''



if __name__ == '__main__':
   app.run(debug = True)