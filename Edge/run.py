import RPi.GPIO as GPIO
import time
import sys
from hx711 import HX711

# Force Python 3 ###########################################################

if sys.version_info[0] != 3:
    raise Exception("Python 3 is required.")

############################################################################


hx = HX711(5, 6)
hx2 = HX711(23,24)

    


def cleanAndExit():
    print("Cleaning...")
    GPIO.cleanup()
    print("Bye!")
    sys.exit()


def setup1():
    """
    code run once
    """
    print("Initializing Base 1.\n Please ensure that the scale is empty.")
    scale_ready = False
    while not scale_ready:
        if (GPIO.input(hx.DOUT) == 0):
            scale_ready = False
        if (GPIO.input(hx.DOUT) == 1):
            print("Initialization complete!")
            scale_ready = True


def calibrate1():
    readyCheck = input("Remove any items from scale. Press any key when ready.")
    offset = hx.read_average()
    print("Value at zero (offset): {}".format(offset))
    hx.set_offset(offset)
    print("Please place an item of known weight on the scale.")

    readyCheck = input("Press any key to continue when ready.")
    measured_weight = (hx.read_average()-hx.get_offset())
    item_weight = input("Please enter the item's weight in grams.\n>")
    scale = int(measured_weight)/int(item_weight)
    hx.set_scale(scale)
    print("Scale 1 adjusted for grams: {}".format(scale))
    val = hx.get_grams()
    hx.power_down()
    time.sleep(.001)
    hx.power_up()
    print("Item weighs {} grams.\n".format(val))


def setup2():
    """
    code run once
    """
    print("Initializing Base 2.\n Please ensure that the scale is empty.")
    scale_ready = False
    while not scale_ready:
        if(GPIO.input(hx2.DOUT) == 0):
            print("Base 2 not connected!")
            return(False)
        

        if (GPIO.input(hx2.DOUT) == 1):
            print("Initialization complete!")
            scale_ready = True
            return(True)


def calibrate2():
    readyCheck = input("Remove any items from scale. Press any key when ready.")
    offset = hx2.read_average()
    print("Value at zero (offset): {}".format(offset))
    hx2.set_offset(offset)
    print("Please place an item of known weight on the scale.")

    readyCheck = input("Press any key to continue when ready.")
    measured_weight = (hx2.read_average()-hx2.get_offset())
    item_weight = input("Please enter the item's weight in grams.\n>")
    scale = int(measured_weight)/int(item_weight)
    hx2.set_scale(scale)
    print("Scale 2 adjusted for grams: {}".format(scale))
    val2 = hx2.get_grams()
    hx2.power_down()
    time.sleep(.001)
    hx2.power_up()
    print("Item weighs {} grams.\n".format(val2))

def setup_loop1():
    """
    code run continuously
    """
    try:
        prompt_handled = False
        while not prompt_handled:
            val = hx.get_grams()
            hx.power_down()
            time.sleep(.001)
            hx.power_up()
            print("Item weighs {} grams.\n".format(val))
            choice = input("Please choose:\n"
                           "[1] Recalibrate.\n"
                           "[2] Display offset and scale and weigh an item!\n"
                           "[0] Continue.\n>")
            if choice == "1":
                calibrate1()
            elif choice == "2":
                print("\nOffset: {}\nScale: {}".format(hx.get_offset(), hx.get_scale()))
            elif choice == "0":
                prompt_handled = True
                continue
            else:
                print("Invalid selection.\n")
    except (KeyboardInterrupt, SystemExit):
        cleanAndExit()

def setup_loop2():
    """
    code run continuously
    """
    try:
        prompt_handled = False
        while not prompt_handled:
            val = hx2.get_grams()
            hx2.power_down()
            time.sleep(.001)
            hx2.power_up()
            print("Item weighs {} grams.\n".format(val))
            choice = input("Please choose:\n"
                           "[1] Recalibrate.\n"
                           "[2] Display offset and scale and weigh an item!\n"
                           "[0] Continue.\n>")
            if choice == "1":
                calibrate2()
            elif choice == "2":
                print("\nOffset: {}\nScale: {}".format(hx2.get_offset(), hx2.get_scale()))
            elif choice == "0":
                prompt_handled = True
                continue
            else:
                print("Invalid selection.\n")
    except (KeyboardInterrupt, SystemExit):
        cleanAndExit()



def setup():
    """
    code run once
    """
    hx.set_offset(8421264.9375)
    hx.set_scale(-23.323)

    hx2.set_offset(8595686.125)
    hx2.set_scale(16.214)


def loop():
    """
    code run continuosly
    """

    try:
        val = max(0, int(hx.get_grams()))
        print("1:" + str(val))

        val2 = max(0, int(hx2.get_grams()))
        print("2:" + str(val2))

        hx.power_down()
        hx2.power_down()
        time.sleep(0.1)
        hx.power_up()
        hx2.power_up()

        time.sleep(0.1)
    except (KeyboardInterrupt, SystemExit):
        cleanAndExit()

def selection():
    try:
        while True:
            print("---- Main Menu -----\n") 
            choice = input("Please choose:\n"
                           "[1] Calibrate Base 1!\n"
                           "[2] Calibrate Base 2!\n"
                           "[0] Display Values.\n>")
            if choice == "1":
                setup1()
                calibrate1()
                setup_loop1()
            elif choice == "2":
                if(setup2() == True):
                    calibrate2()
                    setup_loop2()
            elif choice == "0":
                try: 
                    print("Offset and Scale Values: ")
                    print("\n Base 1:\n Offset: {}\n Scale: {}".format(hx.get_offset(), hx.get_scale()))
                    print("\n Base 2:\n Offset: {}\n Scale: {}".format(hx2.get_offset(), hx2.get_scale()))

                    while True:
                        loop()
                except(KeyboardInterrupt, SystemExit):
                    cleanAndExit()
            else:
                print("Invalid selection.\n")
    except (KeyboardInterrupt, SystemExit):
        cleanAndExit()




##################################

if __name__ == "__main__":

    setup()

    while True:
        selection()
