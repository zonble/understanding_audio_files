# FLAC Stream Info Encoder 範例

以下是使用 Pyhton 2 撰寫的 FLAC Stream Info Encoder 範例。作者為 zonble。

``` python
#!/usr/bin/env python
# encoding: utf-8

class BitWriter:
    def __init__(self):
        super().__init__()
        self.out_data = bytearray()
        self._out_byte = 0
        self._out_count = 0

    def write_bit(self, bit):
        self._out_byte = (self._out_byte << 1) | (1 if bit == True else 0)
        self._out_count += 1
        if self._out_count == 8:
            self.out_data.append(self._out_byte)
            self._out_byte = 0
            self._out_count = 0

    def flush(self):
        if self._out_count == 0:
            return
        if self._out_count < 8:
            self._out_byte = self._out_byte << (8 - self._out_count)
        self.out_data.append(self._out_byte)
        self._out_byte = 0
        self._out_count = 0

    def write_unsigned_int(self, number, bit_count):
        for i in range(bit_count -1, -1, -1):
            bit = (number & (1<<i)) != 0
            self.write_bit(bit)

class StreamInfo:
    MIN_BLOCK_SIZE_LEN = 16
    MAX_BLOCK_SIZE_LEN = 16
    MIN_FRAME_SIZE_LEN = 24
    MAX_FRAME_SIZE_LEN = 24
    SAMPLE_RATE_LEN = 20
    CHANNELS_LEN = 3
    BITS_PER_SAMPLE_LEN = 5
    TOTAL_SAMPLES_LEN = 36
    MD5SUM_LEN = 128

    def __init__(self, **kwargs):
        super().__init__()
        self.is_last_metadata_block = kwargs.get('is_last_metadata_block', True)
        self.min_block_size = kwargs.get('min_block_size', 4608)
        self.max_block_size = kwargs.get('max_block_size', 4608)
        self.min_frame_size = kwargs.get('min_frame_size', 14)
        self.max_frame_size = kwargs.get('max_frame_size', 15521)
        self.sample_rate = kwargs.get('sample_rate', 48000)
        self.n_channels = kwargs.get('n_channels', 2)
        self.bits_per_channel = kwargs.get('bits_per_channel', 16)
        self.n_samples = kwargs.get('n_samples', 0)
        self.checksum = None

    def data(self, withHeader = True):
        writer = BitWriter()
        if withHeader:
            writer.write_unsigned_int(1 if self.is_last_metadata_block else 0, 1)
            writer.write_unsigned_int(0, 7)
            length = (StreamInfo.MIN_BLOCK_SIZE_LEN +
                StreamInfo.MAX_BLOCK_SIZE_LEN +
                StreamInfo.MIN_FRAME_SIZE_LEN +
                StreamInfo.MAX_FRAME_SIZE_LEN +
                StreamInfo.SAMPLE_RATE_LEN +
                StreamInfo.CHANNELS_LEN +
                StreamInfo.BITS_PER_SAMPLE_LEN +
                StreamInfo.TOTAL_SAMPLES_LEN +
                StreamInfo.MD5SUM_LEN) / 8
            writer.write_unsigned_int(int(length), 24)
        writer.write_unsigned_int(self.min_block_size, StreamInfo.MIN_BLOCK_SIZE_LEN)
        writer.write_unsigned_int(self.max_block_size, StreamInfo.MAX_BLOCK_SIZE_LEN)
        writer.write_unsigned_int(self.min_frame_size, StreamInfo.MIN_FRAME_SIZE_LEN)
        writer.write_unsigned_int(self.max_frame_size, StreamInfo.MAX_FRAME_SIZE_LEN)
        writer.write_unsigned_int(self.sample_rate, StreamInfo.SAMPLE_RATE_LEN)
        writer.write_unsigned_int(self.n_channels -1, StreamInfo.CHANNELS_LEN)
        writer.write_unsigned_int(self.bits_per_channel -1, StreamInfo.BITS_PER_SAMPLE_LEN)
        writer.write_unsigned_int(self.n_samples, StreamInfo.TOTAL_SAMPLES_LEN)
        data = writer.out_data
        if self.checksum != None and len(self.checksum) == 16:
            data += self.checksum
        else:
            writer.write_unsigned_int(0, StreamInfo.MD5SUM_LEN)
            data = writer.out_data
        return data
```