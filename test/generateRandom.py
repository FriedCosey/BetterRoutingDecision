import random
import sys
def generateRand(num):
    with open('inputList.txt', mode='w') as input:
        for _ in range(int(num)):
            lat = str(33 + random.uniform(-2, 2))
            lng = str(-84 + random.uniform(-2, 2))
            input.write("{} {}\n".format(lat, lng))

if __name__ == "__main__":
    generateRand(sys.argv[1])

