'use client'
import { useState, useEffect } from 'react';
// import VideoCard from '@/app/components/VideoCard';
// import { Card, CardContent } from '@/app/components/ui/Card'
// import { TabsList } from '../components/ui/Tabs';



export default function Video() {
  const [videoUrl, setVideoUrl] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  // const [showSubtitles, setShowSubtitles] = useState(false);
  // const [showQuiz, setShowQuiz] = useState(false);
  const [activeValue, setActiveValue] = useState('');
  const [clipIndex, setClipIndex] = useState(1); // 追蹤當前片段
  const [season, setSeason] = useState('Season_1'); // 選擇的季節
  const [episode, setEpisode] = useState('Episode_1'); // 選擇的集數
  const [clips, setClips] = useState([]);
  const [totalClips, setTotalClips] = useState(0);

  useEffect(() => {
    async function fetchClips() {
      try {
        // 使用季節和集數獲取對應片段
        const response = await fetch(`/api/get-sign-url?season=${season}&episode=${episode}&fileName=${clipIndex}`);
        // http://localhost:3000/api/get-sign-url?season=Season_1&episode=Episode_1&fileName=3
        const data = await response.json();
        console.log('data:::', data)
        // setClips(data.clips); // clips 是包含每個片段的 URL 和字幕 URL 的陣列
        setVideoUrl(data.videoUrl)
        const subtitleResponse = await fetch(data.subtitleUrl);
        const subtitleText = await subtitleResponse.text();
        setSubtitleText(subtitleText);

        setTotalClips(data.totalClips || 10);

        // setClipIndex(0); // 每次更換集數時，從第一個片段開始
      } catch (error) {
        console.error('Error fetching clips:', error);
      }
    }

    fetchClips();
  }, [season, episode, clipIndex]);

  const handlePreviousClip = () => {
    if (clipIndex > 1) setClipIndex(clipIndex - 1);
  };

  const handleNextClip = () => {
    if (clipIndex < totalClips) setClipIndex(clipIndex + 1);
  };

  useEffect(() => {
    console.log('clipIndex updated:', clipIndex);
  }, [clipIndex]);


  return (
    <div className='flex flex-col p-4 bg-[#edede9] '>
      <h3 className='text-[24px]'>Breaking Bad series</h3>
      {/* video Player */}
      <main className='border-[#d5bdaf] border-2 p-3 rounded-md flex flex-col items-center'>
        <video controls className="w-full md:w-1/2 rounded-lg shadow-lg"
          src={videoUrl}>
        </video>
        <div className='flex justify-between p-2 w-full md:w-1/2'>
          <select value={season} onChange={(e) => setSeason(e.target.value)}>
            <option value="Season_1">Season 1</option>
            {/* <option value="Season_2">Season 2</option>
            <option value="Season_3">Season 3</option>
            <option value="Season_4">Season 4</option>
            <option value="Season_5">Season 5</option>
            <option value="Season_6">Season 6</option>
            <option value="Season_7">Season 7</option> */}
          </select>
          <select value={episode} onChange={(e) => setEpisode(e.target.value)}>
            {/* <option value="Episode_1">Episode 1</option>
            <option value="Episode_2">Episode 2</option> */}
            <option value="Episode_3">Episode 3</option>
            <option value="Episode_4">Episode 4</option>
            <option value="Episode_5">Episode 5</option>
            <option value="Episode_6">Episode 6</option>
            <option value="Episode_7">Episode 7</option>

          </select>
        </div>
        <div className='w-full flex justify-end'>
          <div className='w-[240px] flex justify-end my-1 space-x-4'>
            <button className='text-white font-bold bg-[#6c584c] p-1 rounded-md'
              onClick={handlePreviousClip}
              disabled={clipIndex === 1}>
              Pre Clip
            </button>
            <button className='text-white font-bold bg-[#6c584c] p-1 rounded-md'
              onClick={handleNextClip}
              disabled={clipIndex === totalClips}>
              Next Clip
            </button>
          </div>
        </div>
      </main>
      <div className='bg-[#d6ccc2] p-2 rounded-md text-white '>
        {/* subtitleText */}
        {/* <TabsList className='flex justify-between w-full'>
          <button>Subtitle</button>
          <button>Vocabulary</button>
          <button>Quiz</button>
        </TabsList> */}
        <div className='flex justify-around w-full border-b-2 border-[#edede9] font-bold'>
          <button className=''
            onClick={() => { setActiveValue('subtitles') }}>
            Subtitle</button>
          <button>Vocabulary</button>
          <button onClick={() => { setActiveValue('quiz') }}>
            Quiz</button>
        </div>
        <div className='text-black'>
          {activeValue === 'subtitles' && subtitleText.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          {activeValue === 'quiz' &&
            <div className='w-full flex flex-col'>
              <textarea className='w-full my-2 p-2' rows="5" placeholder='Write down what you listened...' >

              </textarea>
              <div className='w-full flex justify-end'>
                <button className='text-white font-bold bg-[#6c584c] p-1 rounded-md'>
                  submit
                </button>
              </div>
            </div>
          }
        </div>

      </div>

    </div>
  )
}