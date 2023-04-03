# MP3 Parser 範例

以下是使用 Pyhton 2 撰寫的 MP3 以及 ID3 Parser 範例。作者為 zonble。

```python
#!/usr/bin/env python
# encoding: utf-8

import os
import sys
import struct

class MP3Parser:
    '''
    Parse mp3 file to check if there is invalid frame.
    '''

    class _Header:
        '''
        Represent the ID3 header in a tag.
        '''
        def __init__(self):
            self.majorVersion = 0
            self.revision = 0
            self.flags = 0
            self.size = 0
            self.bUnsynchronized = False
            self.bExperimental = False
            self.bFooter = False

        def __str__(self):
            return str(self.__dict__)

    @classmethod
    def _getSyncSafeInt(self, bytes):
        '''
        Get integer from 4 bytes
        '''
        assert len(bytes) == 4
        if type(bytes) == type(''):
            bytes = [ ord(c) for c in bytes ]
        return (bytes[0] << 21) + (bytes[1] << 14) + (bytes[2] << 7) + bytes[3]

    @classmethod
    def isAllFramesValid(self, inInputFilePath):
        '''
        Check if all frames are valid.

        If we encounter frame that is not MPEG version 1, layer 3,
        sample rate 44.1 KHz, we return False.

        Because MP3 File should be frame after frame, if we skip any
        byte between frames, we return False.

        Otherwise, this function will return True.

        :param inInputFilePath: the mp3 file path to check.
        :type inInputFilePath: str
        :returns: whether all frames are valid.
        :rtype: bool

        '''
        content = self.loadFile(inInputFilePath)
        return self.isAllFramesInDataValid(content)

    @classmethod
    def isAllFramesInDataValid(self, content, offset = 0, shouldCheckID3Tag = True):
        '''
        Check if all frames are valid in bytes.

        :param offset: offset into content.
        :type offset: integer
        :param shouldCheckID3Tag: whether we should check for id3 tag
            or not.
        :type shouldCheckID3Tag: bool

        '''
        if offset > len(content):
            return False
        MP3BitrateLookup = [0, 32000, 40000, 48000, 56000, 64000, 80000, 96000, 112000, 128000, 160000, 192000, 224000, 256000, 320000, 0]

        # The first 512 bytes are Internal Header, so we can skip them.
        # Based on mac's code, it seems that we always will get ID3
        # tag, so we can also just scan for ID3 tag.
        i = offset
        foundFirstFrame = False

        # skip id3 tag
        while i + 10 < len(content) and shouldCheckID3Tag:
            header = content[i:i+10]
            hstuff = struct.unpack("!3sBBBBBBB", str(header))
            if hstuff[0] == "ID3":
                header = self._Header()
                header.majorVersion = hstuff[1]
                header.revision = hstuff[2]
                header.flags = hstuff[3]
                header.size = self._getSyncSafeInt(hstuff[4:8])
                hasFooter = not not (header.flags & 0x40)
                headerBodylength = header.size
                headerLength = headerBodylength + (20 if hasFooter else 10)
                i += headerLength
                break
            else:
                i += 1

        while i + 2 < len(content):
            frameSync = (content[i] << 8) | (content[i + 1] & (0x80 | 0x40 | 0x20))
            if frameSync != 0xffe0:
                if foundFirstFrame:
                    # After founding first frame, we shouldn't skip
                    # any byte, so if we execute to here, there is an
                    # error.
                    # print 'skipping byte at:' + repr(i)
                    pass
                i += 1
                continue


            # frame start
            if not foundFirstFrame:
                foundFirstFrame = True
            # print i
            # AAAAAAAA AAABBCCD EEEEFFGH IIJJKLMM
            audioVersion = (content[i + 1] >> 3) & 0x03;
            layer = (content[i + 1] >> 1) & 0x03
            hasCRC = not(content[i + 1] & 0x01)
            bitrateIndex = content[i + 2] >> 4;
            sampleRateIndex = content[i + 2] >> 2 & 0x03;
            # print 'audioVersion:%d, layer:%d, sampleRateIndex:%d' % (audioVersion, layer, sampleRateIndex)
            if not(audioVersion == 0x03 and
                   layer == 0x01 and
                   sampleRateIndex == 0x00):
                # we only support MPEG version 1, layer 3, sample rate
                # 44.1 KHz--and we ignore the error altogether
                print "Unsupported MPEG audio version."
                return False

            bitrate = MP3BitrateLookup[bitrateIndex];
            hasPadding = not(not((content[i + 2] >> 1) & 0x01))
            # print 'hasCRC:%d, hasPadding:%d' % (hasCRC, hasPadding)

            frameLength = 144 * bitrate / 44100 + \
                          (1 if hasPadding else 0) + \
                          (2 if hasCRC else  0)
            i += frameLength
        if not foundFirstFrame:
            return False
        return True

    @classmethod
    def loadFile(self, inInputFilePath):
        '''
        Load file into bytearray

        :param inInputFilePath: path of the input file.
        :type inInputFilePath: str
        '''
        inputFile = open(inInputFilePath, 'rb')
        data = bytearray(inputFile.read())
        inputFile.close()
        return data

def printUsage():
    print '''Usage: python %s [MP3 file]
Example: python %s 1311434.mp3
It will parse all frames in mp3 file and return parse result as bool.''' % (sys.argv[0], sys.argv[0])

if __name__ == '__main__':
    if len(sys.argv) != 2:
        printUsage()
        exit()
    filename = str(sys.argv[1])
    if not(os.path.exists(filename)):
        print 'File not found: %s' % (filename)
        printUsage()
        exit()
    result = MP3Parser.isAllFramesValid(filename)
    print result

```
