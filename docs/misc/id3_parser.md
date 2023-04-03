# ID3 Parser 範例

以下是使用 Pyhton 2 撰寫的 ID3 Parser 範例。作者為 zonble。

```python
#!/usr/bin/env python
# encoding: utf-8

'''
The :mod:`KKID3TagReader` module helps to read ID3 tags from an MP3 audio
file.
'''

def _parseID3TagsFromFileStream(f):
    '''
    Parses ID3 tags from a file stream

    :param f: path of the file.
    :type f: file
    :returns: ID3 tags
    :rtype: list

    .. note:: Not tested on IronPython.
    '''
    HEADER_LENGTH = 10
    HEADER_BODY_LENGTH_INFO_OFFSET = 6
    HEADER_BODY_LENGTH_INFO_LENGTH = 4
    FRAME_HEADER_LENGTH = 10
    FRAME_ID_LENGTH = 4
    FRAME_BODY_LENGTH_INFO_LENGTH = 4

    def _readUInt28(bytes):
        MASK = lambda bits : ((1 << (bits)) - 1)
        BITSUSED = 7
        val = 0
        for byte in bytes: val =  (val << BITSUSED) | (byte & MASK(BITSUSED))
        return min(val,  MASK(BITSUSED * 4))

    bytes = bytearray(f.read())
    ID3TagHeader = bytes[0:HEADER_LENGTH]
    if not str(ID3TagHeader).startswith('ID3'): return {}

    tags = {}
    ID3TagBodyLength = _readUInt28(list(ID3TagHeader)[HEADER_BODY_LENGTH_INFO_OFFSET:HEADER_BODY_LENGTH_INFO_OFFSET+HEADER_BODY_LENGTH_INFO_LENGTH])
    readHead = HEADER_LENGTH
    while readHead < ID3TagBodyLength:
        frameHeader = bytes[readHead:readHead + FRAME_HEADER_LENGTH]
        frameID = str(frameHeader[0:FRAME_ID_LENGTH])
        frameBodyLength = _readUInt28(frameHeader[FRAME_ID_LENGTH:FRAME_ID_LENGTH + FRAME_BODY_LENGTH_INFO_LENGTH])

        frameBody = bytes[readHead + FRAME_HEADER_LENGTH : readHead + FRAME_HEADER_LENGTH + frameBodyLength]
        textEncodingType = int(frameBody[0])
        frameContent = frameBody[1:]
        frameContent = [
            lambda x : str(x),
            lambda x : x.decode('utf-16'),
            lambda x : x.decode('utf-16-be'),
            lambda x : x.decode('utf-8')
            ][textEncodingType](frameContent) if textEncodingType <= 3 \
                else str(frameContent)
        if str(frameID).startswith('NORV') or str(frameID).startswith('T'):
            tags[unicode(frameID)] = frameContent.strip()
        readHead += FRAME_HEADER_LENGTH + frameBodyLength
    return tags

def parseID3TagsFromFileStream(f):
    try:
        return _parseID3TagsFromFileStream(f)
    except Exception, e:
        raise(e)

def parseID3TagsFromFilepath(path):
    '''
    Parses ID3 tags from a specific MP3 audio file.

    :param path: path of the file.
    :type path: str
    :returns: ID3 tags
    :rtype: list
    '''
    return parseID3TagsFromFileStream(open(path, 'rb'))

```
