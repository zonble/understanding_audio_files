# 關於《認識音檔》

2022 and onwards © Weizhong Yang a.k.a zonble

《認識音檔》是一本我在前一份工作離職前（2020 年五月）寫的一本小冊子，就如同標題一般，內容就是講解我在工作上曾經處理過、我所了解的音檔格式。一開始就寫了兩個版本，一個是包含前公司業務內容的版本，另外就是您現在所看到，把公司相關業務內容拿掉，適合公開發佈的版本。原本寫這本手冊，也不是誰特地指派的工作，只是覺得總要有人整理一些 knowhow 而已。

這個版本當中的內容，其實只要花點時間，都可以透過搜尋引擎，在網路上找到相關的公開資料，只是您可能不確定應該要使用什麼關鍵字搜尋，而這本手冊中，算是我個人整理過的系統化知識，希望可以對需要了解音檔格式是什麼的朋友有些幫助。

音檔—或是說，各種電腦檔案格式，並不是各種資訊教育會特別講解的一塊，對絕大多數的電腦用戶來說，只要能夠把聲音播出來就夠了；你問任何一個電腦用戶「什麼是 MP3」？大概所有人都可以講出「MP3 是一種檔案」，但 MP3 是怎樣的檔案？ MP3 與 AAC 有什麼不同，能夠回答的就很少，因為沒有特別了解的必要。

甚至在業界，其實也只有在少數公司任職的工程師需要了解，大概也只有遇到產製音檔，或是播放音檔這些需求，需要製作播放軟體時才有特地了解的必要。所以，即使什麼資料在網路上都很容易找到，但是想要了解這些網路上的文件到底在講什麼，其實也要花上一段時間。起碼我自認花了不少時間。

即使是工程師都要花上不少時間，在數位音樂、或是其他與電腦音檔相關的產業，還有其他不同功能的角色，其實也需要了解音檔，如果你是個想要進入數位音樂產業的 PM，你可能上班的第一天，就可能聽到「客戶反應播放音樂會爆音」、「我們計畫推出高音質方案」等，而這些都是需要對音檔有一定了解才能完成的任務。

我在前一份工作中，主要工作內容之一，就是製作 client 端的播放軟體。所以，這份手冊會更偏向 client 端的角度，怎樣解析（parse）檔案格式，而且也比較偏重 container 的部份，畢竟跟 codec 有關的部分，也就只能夠呼叫 library－一種音檔格式分成 container 與 codec，我們晚點會說明。至於轉檔工具的使用，怎樣在 server 上、CDN 上佈署檔案，就不是我所熟悉的範圍，所以不會在這份手冊中。

預期在讀完這份文件之後，你可以：

- 以後看到有人提到 48000Hz 24bit 的高音質檔案，可以馬上叫出「這是 DVD 音質」
- 知道音檔分成 codec 以及 container，而且知道這些名詞的意義
- 知道 FairPlay 與 Widevine 這些商用 DRM 所保護的是什麼格式

當中有什麼錯漏之處，也祈請大家指正。大家可以直接 fork 這本手冊然後發 pull request。然後，根據本人過去經驗，應該沒有什麼時間經營討論區或群組，所以 GitHub 上就直接關閉討論版了，相信會用到這本手冊的應該都是同行，應該可以見諒。

## 授權

這本手冊使用 MIT License 釋出。

## 補充

我過去另外寫過一些跟 iOS/macOS 的音檔相關的文件，請參考 [KKBOX iOS/Mac OS X 基礎開發教材](https://kkbox.github.io/kkbox-ios-dev/) 的 [Audio API](https://kkbox.github.io/kkbox-ios-dev/audio_apis/) 章節。

## 連結

- 這本手冊位在 <https://zonble.github.io/understanding_audio_files/>
- GitHub 專案位置在 <https://github.com/zonble/understanding_audio_files>
- [PDF 版本](https://zonble.github.io/understanding_audio_files/understanding_audio_files.pdf)
<!-- - [EPUB 版本](https://zonble.github.io/understanding_audio_files/understanding_audio_files.epub) -->

## 聯絡方式

- [g.dev/zonble](https://g.dev/zonble)
- Twitter [@zonble](https://twitter.com/zonble)
- GitHub [@zonble](https://github.com/zonble/)

## 感謝

在發布之後，感謝以下朋友的指正

- [iXerol](https://github.com/iXerol)
- [kojirou1994](https://github.com/kojirou1994)

## 我工作上曾經遇過的音檔

我在工作上曾經遇過

- PCM
- MP3
- AAC （AAC-MP4 與 AAC-ADTS）
- FLAC
- HLS（HTTP Live-Streaming）
- MPEG-DASH

在接下來的章節中，會逐一說明。
