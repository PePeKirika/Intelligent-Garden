#include <Arduino.h>
#include <softwareSerial.h>
#if defined(ESP32) || defined(ARDUINO_RASPBERRY_PI_PICO_W) || defined(ARDUINO_GIGA) || defined(ARDUINO_OPTA)
#include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#elif __has_include(<WiFiNINA.h>) || defined(ARDUINO_NANO_RP2040_CONNECT)
#include <WiFiNINA.h>
#elif __has_include(<WiFi101.h>)
#include <WiFi101.h>
#elif __has_include(<WiFiS3.h>) || defined(ARDUINO_UNOWIFIR4)
#include <WiFiS3.h>
#elif __has_include(<WiFiC3.h>) || defined(ARDUINO_PORTENTA_C33)
#include <WiFiC3.h>
#elif __has_include(<WiFi.h>)
#include <WiFi.h>
#endif

#include <FirebaseClient.h>
#include "DHT.h"
#define DHT_PIN 15
#define DHT_TYPE DHT11 

DHT dht(DHT_PIN, DHT_TYPE);

#define WIFI_SSID "PePeKirika's iPhone 13 Pro"
#define WIFI_PASSWORD "yaesakura"

#define API_KEY "AIzaSyDwtWZoYqI0IP-pYbD6tQh00kAw3bjxP3E"

#define USER_EMAIL "smartgarden@garden.com"
#define USER_PASSWORD "123456"

#define DATABASE_URL "https://embeded-7133f-default-rtdb.asia-southeast1.firebasedatabase.app//"

void printResult(AsyncResult &aResult);

DefaultNetwork network; // initilize with boolean parameter to enable/disable network reconnection

UserAuth user_auth(API_KEY, USER_EMAIL, USER_PASSWORD);

FirebaseApp app;

#if defined(ESP32) || defined(ESP8266) || defined(ARDUINO_RASPBERRY_PI_PICO_W)
#include <WiFiClientSecure.h>
WiFiClientSecure ssl_client;
#elif defined(ARDUINO_ARCH_SAMD) || defined(ARDUINO_UNOWIFIR4) || defined(ARDUINO_GIGA) || defined(ARDUINO_OPTA) || defined(ARDUINO_PORTENTA_C33) || defined(ARDUINO_NANO_RP2040_CONNECT)
#include <WiFiSSLClient.h>
WiFiSSLClient ssl_client;
#endif

using AsyncClient = AsyncClientClass;

AsyncClient aClient(ssl_client, getNetwork(network));

RealtimeDatabase Database;

AsyncResult aResult_no_callback;

bool taskComplete = false;

#define RXp2 22
#define TXp2 23

SoftwareSerial mySerial(RXp2, TXp2);

void setup()
{

    Serial.begin(115200);
    mySerial.begin(9600);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    Serial.print("Connecting to Wi-Fi");
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(300);
    }
    Serial.println();
    Serial.print("Connected with IP: ");
    Serial.println(WiFi.localIP());
    Serial.println();

    Firebase.printf("Firebase Client v%s\n", FIREBASE_CLIENT_VERSION);

    Serial.println("Initializing app...");

#if defined(ESP32) || defined(ESP8266) || defined(PICO_RP2040)
    ssl_client.setInsecure();
#if defined(ESP8266)
    ssl_client.setBufferSizes(4096, 1024);
#endif
#endif

    initializeApp(aClient, app, getAuth(user_auth), aResult_no_callback);

    app.getApp<RealtimeDatabase>(Database);

    Database.url(DATABASE_URL);
    
}

unsigned long ms = 0;
float Temperature, Humidity;
void loop()
{
    app.loop();

    Database.loop();


    if (millis() - ms > 10000 || ms == 0)
    {
        ms = millis();
        Temperature = dht.readTemperature();
        Serial.println("Temperature:"+String(Temperature));
        Humidity = dht.readHumidity();
        Serial.println("Humidity:"+String(Humidity));
        while (mySerial.available() > 0) {
            String key = mySerial.readStringUntil('\n');
            key.trim();
            Serial.println(key);

            if (key == "=") {
                String soil_moisture_str = mySerial.readStringUntil('\n');
                soil_moisture_str.trim();

                String ldr_str = mySerial.readStringUntil('\n');
                ldr_str.trim();

                String motor_str = mySerial.readStringUntil('\n');
                motor_str.trim();

                if (!soil_moisture_str.isEmpty() && soil_moisture_str.toInt() > 0) {
                    int soil_moisture = soil_moisture_str.toInt();
                    Serial.println("soil_moisture: " + String(soil_moisture));
                    Database.set<int>(aClient, "/garden_database/pots/1/soil_moisture", soil_moisture, aResult_no_callback);
                } else {
                    Serial.println("Invalid soil moisture data: " + soil_moisture_str);
                }
                if (!ldr_str.isEmpty() && ldr_str.toInt() > 0) {
                    int ldr = ldr_str.toInt();
                    Serial.println("ldr: " + String(ldr));
                    Database.set<int>(aClient, "/garden_database/light", ldr, aResult_no_callback);
                } else {
                    Serial.println("Invalid LDR data: " + ldr_str);
                }
                if (!motor_str.isEmpty() && motor_str.toInt() >= 0) {
                    int motor = motor_str.toInt();
                    Serial.println("motor: " + String(motor));
                    Database.set<bool>(aClient, "/garden_database/pots/1/pump", motor, aResult_no_callback);
                } else {
                    Serial.println("Invalid motor data: " + motor_str);
                }
            } else {
                Serial.println("Unexpected key: " + key);
            }
        }


        object_t ts_json;
        JsonWriter writer;
        writer.create(ts_json, ".sv", "timestamp"); // -> {".sv": "timestamp"}
        Database.set<object_t>(aClient, "/garden_database/timestamp", ts_json);
        Database.set<number_t>(aClient, "/garden_database/temperature", number_t(Temperature, 2), aResult_no_callback);
        Database.set<number_t>(aClient, "/garden_database/humidity", number_t(Humidity, 2), aResult_no_callback);
        
        
        
    }

    printResult(aResult_no_callback);
}

void printResult(AsyncResult &aResult)
{
    if (aResult.isEvent())
    {
        Firebase.printf("Event task: %s, msg: %s, code: %d\n", aResult.uid().c_str(), aResult.appEvent().message().c_str(), aResult.appEvent().code());
    }

    if (aResult.isDebug())
    {
        Firebase.printf("Debug task: %s, msg: %s\n", aResult.uid().c_str(), aResult.debug().c_str());
    }

    if (aResult.isError())
    {
        Firebase.printf("Error task: %s, msg: %s, code: %d\n", aResult.uid().c_str(), aResult.error().message().c_str(), aResult.error().code());
    }

    if (aResult.available())
    {
        Firebase.printf("task: %s, payload: %s\n", aResult.uid().c_str(), aResult.c_str());
    }
}