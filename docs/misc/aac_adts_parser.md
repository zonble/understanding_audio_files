# AAC-ADTS Parser 範例

以下是使用 Pyhton 2 撰寫的 ID3 Parser 範例。作者為 Oliver Huang。

```python
#!/usr/bin/env python
# encoding: utf-8

import os
import sys
import time

class ADTSParser:
    '''
    Parse AAC-ADTS file to find first frame offset and check if there is invalid frame.
    '''
    ADTS_MINIMUM_HEADER_SIZE = 7

    class ADTSHeader:
        # AAAAAAAA AAAABCCD EEFFFFGH HHIJKLMM MMMMMMMM MMMOOOOO OOOOOOPP (QQQQQQQQ QQQQQQQQ)
        # AAAAAAAA AAAA: syncword
        # B: MPEG version
        # CC: Layer
        # FFFF: Sample rate
        # HHH: Channel configuration
        # MM MMMMMMMM MMM: Frame length
        SampleRateTable = (96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350)
        def __init__(self, data):
            assert type(data) is bytearray
            self.data = data

        def isValid(self):
            if len(self.data) < ADTSParser.ADTS_MINIMUM_HEADER_SIZE:
                return False
            if self.syncword() != 0xfff0:
                return False
            if self.MPEGVersion() != 4:
                return False
            if self.layer() != 0:
                return False
            if self.sampleRate() != 44100:
                return False
            if self.channelConfig() != 2:
                return False
            return True

        def syncword(self):
            return (self.data[0] << 8) | (self.data[1] & 0xf0)

        def MPEGVersion(self):
            return 4 if (self.data[1] & 0x08) == 0 else 2

        def layer(self):
            return (self.data[1] & 0x06) >> 1

        def sampleRate(self):
            index = (self.data[2] & 0x3c) >> 2
            if index >= len(self.SampleRateTable):
                return 0
            return self.SampleRateTable[index]

        def channelConfig(self):
            return ((self.data[2] & 0x01) << 2) | ((self.data[3] & 0xc0) >> 6)

        def frameLength(self):
            if not self.isValid():
                return 0
            return ((self.data[3] & 0x03) << 11) | (self.data[4] << 3) | ((self.data[5] & 0xe0) >> 5)

    @classmethod
    def parseAACFile(self, inInputFilePath):
        '''
        Check if all frames are valid and get offset of first frame.

        A valid frame will be MPEG-4, 2-channels and sample rate 44.1 KHz.

        This function will find first two valid frames without bytes between it.

        If we encounter frame that is not valid after first frame, we return False.

        Otherwise, this function will return True.

        :param inInputFilePath: the aac file path to check.
        :type inInputFilePath: str
        :returns: A tuple (first ADTS frame offset, whether all frames after offset are valid)
        :rtype: 2-tuple

        '''
        inputFile = open(inInputFilePath, 'rb')
        content = bytearray(inputFile.read())
        inputFile.close()

        return self.isAllFramesInDataValid(content)

    @classmethod
    def isAllFramesInDataValid(self, content):
        '''
        Check if all frames are valid in bytes.

        :param content: audio content to check.
        :type content: bytearray
        :returns: A tuple (first ADTS frame offset, whether all frames after offset are valid)
        :rtype: 2-tuple

        '''
        offset = 0
        firstOffset = -1
        length = len(content)
        tStart = time.time()
        tLast = tStart

        while offset + self.ADTS_MINIMUM_HEADER_SIZE < length:
            tCurrect = time.time()
            if tCurrect - tLast > 1:
                print 'Total file length: %d, current offset: %d, time elapsed: %.3f' % (length, offset, tCurrect - tStart)
                tLast = tCurrect

            frame = self.ADTSHeader(content[offset:offset + self.ADTS_MINIMUM_HEADER_SIZE])
            if firstOffset == -1:
                if frame.isValid() and frame.frameLength() > 0:
                    secondOffset = offset + frame.frameLength()
                    if secondOffset + self.ADTS_MINIMUM_HEADER_SIZE > length:
                        return (-1, False)
                    second = self.ADTSHeader(content[secondOffset:secondOffset + self.ADTS_MINIMUM_HEADER_SIZE])
                    if second.isValid() and second.frameLength() > 0:
                        firstOffset = offset
                        offset = secondOffset + second.frameLength()
                        continue
                offset += 1
            elif not frame.isValid():
                return (-1, False)
            else:
                offset += frame.frameLength()

        return (firstOffset, firstOffset >= 0)

def printUsage():
    print '''Usage: python %s [AAC file]
Example: python %s 24023614.aac
It will find first ADTS frame offset and parse all frames in aac file and return parse result as bool.''' % (sys.argv[0], sys.argv[0])

if __name__ == '__main__':
    if len(sys.argv) != 2:
        printUsage()
        exit()
    filename = sys.argv[1]
    if not os.path.exists(filename):
        print 'File not found: %s' % (filename)
        printUsage()
        exit()
    offset, isValid = ADTSParser.parseAACFile(filename)
    print isValid
    if isValid:
        print "First frame offset: %d" % offset

```
