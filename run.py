from pytube import YouTube

def download_youtube_video(url):
    try:
        yt = YouTube(url)
        stream = yt.streams.get_highest_resolution()
        stream.download()
        print(f"다운로드 완료: {yt.title}")
    except Exception as e:
        print(f"다운로드 중 오류 발생: {e}")

if __name__ == "__main__":
    video_url = input("다운로드할 YouTube 영상 URL을 입력하세요: ")
    download_youtube_video(video_url)
