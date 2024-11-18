int sensorPin = A0;
int Relay1 = 4;
int ldrPin = A2;

unsigned long lastSerialTime = 0; // ตัวแปรสำหรับเก็บเวลา

int motor_state = 0;

void setup() {
  Serial.begin(9600);
  pinMode(Relay1, OUTPUT); // กำหนดขาทำหน้าที่ให้ขา 4 เป็น OUTPUT
  digitalWrite(Relay1, HIGH);
  delay(500);
}

void loop() {
  int sensorValue;
  int ldrValue;

  // อ่านค่าจากเซ็นเซอร์
  sensorValue = analogRead(sensorPin);
  sensorValue = map(sensorValue, 0, 1023, 0, 100);
  ldrValue = analogRead(ldrPin);

  // ตรวจสอบเงื่อนไขการควบคุม Relay
  if (sensorValue > 50) {
    digitalWrite(Relay1, LOW); // ส่งให้ไฟดับ
    motor_state = 1;
  } else {
    digitalWrite(Relay1, HIGH); // ส่งให้ไฟติด
    motor_state = 0;
  }

  // แสดงค่าทาง Serial Monitor ทุก 20 วินาที
  if (millis() - lastSerialTime >= 10000) { // 20000ms = 20 วินาที
    Serial.println("=");
    Serial.println(sensorValue);
    Serial.println(ldrValue);
    Serial.println(motor_state);
    lastSerialTime = millis(); // อัปเดตเวลา
  }

  delay(1000); // หน่วงเวลาในลูป 1 วินาที
}