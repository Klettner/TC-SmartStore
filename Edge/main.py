import RPi.GPIO as GPIO
import time
import sys
from hx711 import HX711
from requests_gql import create_pallet, delete_pallet, update_pallet_weight


hx = HX711(5, 6)
hx2 = HX711(23,24)

def cleanAndExit():
    print("Cleaning...")
    GPIO.cleanup()
    print("Bye!")
    sys.exit()

def setup():
    """
    code run once
    """
    hx.set_offset(8407869.9375)
    hx.set_scale(-18.48)

    hx2.set_offset(8389119.9375)
    hx2.set_scale(-0.2044)

    check_and_update_pallet1()
    check_and_update_pallet2()

def loop():
    """
    code run continuosly
    """
    try:
        try:
            if (GPIO.input(hx.DOUT) == 1):
                val = max(0, int(hx.get_grams()))
                count1 = round(val/50)
                weight1 = count1 * 50
                update_pallet_weight("A1", weight1)
                print("1:" + str(weight1))
        except:
            print("Error while updating pallet weight")

        try:
            if (GPIO.input(hx2.DOUT) == 1):
                val2 = max(0, int(hx2.get_grams()))
                count2 = round(val2/50)
                weight2 = count2 * 50
                update_pallet_weight("A2", weight2)
                print("2:" + str(weight2))
        except:
            print("Error while updating pallet weight")

        hx.power_down()
        hx2.power_down()
        time.sleep(0.1)
        hx.power_up()
        hx2.power_up()

        time.sleep(0.1)
    except (KeyboardInterrupt, SystemExit):
        cleanAndExit()

def check_and_update_pallet2():
    try:
        if (GPIO.input(hx2.DOUT) == 0):
            delete_pallet("A2")
    
        if (GPIO.input(hx2.DOUT) == 1):
            val2 = max(0, int(hx2.get_grams()))
            create_pallet("A2", val2)
    except:
        print("Error while creating/deleting Pallet")

def check_and_update_pallet1():
    try:
        if (GPIO.input(hx.DOUT) == 0):
            delete_pallet("A1")
    
        if (GPIO.input(hx.DOUT) == 1):
            val1 = max(0, int(hx.get_grams()))
            create_pallet("A1", val1)
    except:
        print("Error while creating/deleting Pallet")

if __name__ == "__main__":

    setup()

    while True:
        loop()
