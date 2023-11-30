# CustomHtmlQrcodeUI
UI 커스터마이징이 가능한 html5-qrcode 라이브러리를 사용하는 뼈대 코드, Flask 사용

### Requirements
```
pip install flask
```

### Run
```
python app.py
```

## 카메라 기능을 사용하려면 https통신이 필요함
테스트용 https 사용을 위해 ngrok을 설치할 것임

#### ngrok 설치
```
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc |   sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null &&   echo "deb https://ngrok-agent.s3.amazonaws.com buster main" |   sudo tee /etc/apt/sources.list.d/ngrok.list &&   sudo apt update && sudo apt install ngrok
```

#### ngrok을 Flask서버에 연결
```
ngrok http 5000
```
5000은 Flask서버의 포트번호임

#### 실행 후 접속
```
ngrok                                                                                                      (Ctrl+C to quit)
                                                                                                                           
Introducing Pay-as-you-go pricing: https://ngrok.com/r/payg                                                                
                                                                                                                           
Session Status                online                                                                                       
Account                       kjh36102@xxx.com (Plan: Free)                                                              
Version                       3.4.0                                                                                        
Region                        Japan (jp)                                                                                   
Latency                       40ms                                                                                         
Web Interface                 http://127.0.0.1:4040                                                                        
Forwarding                    https://4233-518-133-31-156.ngrok-free.app -> http://localhost:5000                          
                                                                                                                           
Connections                   ttl     opn     rt1     rt5     p50     p90                                                  
                              0       0       0.00    0.00    0.00    0.00                                                 
                                                                                            
```
Forwarding 의 https주소를 이용해 접속가능함
