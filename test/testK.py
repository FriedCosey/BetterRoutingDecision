import requests
import sys
import os
import time

def getBikeMarta(k):
    fileName = "output" + str(k) + ".txt"
    if os.path.exists(fileName):
        os.remove(fileName)
        print("Removed {}".format(fileName))

    with open('inputList.txt', mode='r') as input:
        start = time.clock()

        while True:
            coord1 = input.readline()
            if not coord1:
                break
            coord2 = input.readline()
            if not coord2:
                break
            coord1 = coord1.split()
            coord2 = coord2.split()
            r = requests.get("http://3.18.223.207:8080/dist/walk/bike/walk?k=" + str(k) + "&lat1=" + coord1[0] + "&lng1=" + coord1[1] + "&lat2=" + coord2[0] + "&lng2=" + coord2[1])
            with open('output' + k + '.txt', mode='a') as output:
                output.write("{}\n".format(r.json()[0]))

        end = time.clock()
        with open('output' + k + '.txt', mode='a') as output:
                output.write("Spent %.2f seconds \n"%(end - start))

if __name__ == "__main__":
    getBikeMarta(sys.argv[1])

