
import { TopicVocabulary } from '../types';

export const TOPIC_DATA: TopicVocabulary[] = [
  {
    id: 'animals',
    name: 'Animals (Module 1)',
    icon: '🐾',
    description: 'Pets, wildlife, zoos, and protecting endangered species.',
    nouns: [
      { word: 'Wildlife', definition: 'Động vật hoang dã' },
      { word: 'Habitat', definition: 'Môi trường sống' },
      { word: 'Species', definition: 'Loài' },
      { word: 'Pet', definition: 'Thú cưng' },
      { word: 'Vet', definition: 'Bác sĩ thú y' },
      { word: 'Zoo', definition: 'Sở thú' },
      { word: 'Fur', definition: 'Bộ lông thú' }
    ],
    verbs: [
      { word: 'Protect', definition: 'Bảo vệ' },
      { word: 'Feed', definition: 'Cho ăn' },
      { word: 'Train', definition: 'Huấn luyện' },
      { word: 'Hunt', definition: 'Săn bắt' },
      { word: 'Survive', definition: 'Sinh tồn' }
    ],
    adjectives: [
      { word: 'Wild', definition: 'Hoang dã' },
      { word: 'Domestic', definition: 'Nuôi trong nhà' },
      { word: 'Endangered', definition: 'Có nguy cơ tuyệt chủng', example: 'Pandas are endangered animals.' },
      { word: 'Loyal', definition: 'Trung thành' },
      { word: 'Dangerous', definition: 'Nguy hiểm' }
    ],
    phrases: [
      { word: 'Look after', definition: 'Chăm sóc' },
      { word: 'Die out', definition: 'Tuyệt chủng (dần dần)' },
      { word: 'Take care of', definition: 'Chăm sóc' }
    ],
    structures: [
      { 
        pattern: "S + spend + time/money + V-ing", 
        explanation: "Dành thời gian làm gì", 
        example: "I spend a lot of time playing with my dog." 
      },
      { 
        pattern: "It is important to + V", 
        explanation: "Quan trọng để làm gì", 
        example: "It is important to protect wildlife habitats." 
      },
      { 
        pattern: "Comparative: Adj-er / more + Adj + than", 
        explanation: "So sánh hơn", 
        example: "Dogs are more loyal than cats." 
      }
    ],
    modelSentences: [
      { english: "We should protect endangered animals from hunters.", vietnamese: "Chúng ta nên bảo vệ động vật quý hiếm khỏi thợ săn." },
      { english: "My favorite pet is a dog because it is very friendly and loyal.", vietnamese: "Thú cưng yêu thích của tôi là chó vì nó rất thân thiện và trung thành." },
      { english: "Zoos can help children learn more about wildlife.", vietnamese: "Sở thú có thể giúp trẻ em học hỏi thêm về thế giới hoang dã." }
    ]
  },
  {
    id: 'customs',
    name: 'Customs & Traditions (Module 2)',
    icon: '🏮',
    description: 'Festivals, celebrations, weddings, and cultural habits.',
    nouns: [
      { word: 'Festival', definition: 'Lễ hội' },
      { word: 'Celebration', definition: 'Sự ăn mừng' },
      { word: 'Custom', definition: 'Phong tục' },
      { word: 'Tradition', definition: 'Truyền thống' },
      { word: 'Costume', definition: 'Trang phục hóa trang/truyền thống' },
      { word: 'Ceremony', definition: 'Buổi lễ' },
      { word: 'Relative', definition: 'Họ hàng' }
    ],
    verbs: [
      { word: 'Celebrate', definition: 'Ăn mừng' },
      { word: 'Decorate', definition: 'Trang trí' },
      { word: 'Participate in', definition: 'Tham gia vào' },
      { word: 'Exchange', definition: 'Trao đổi (quà)' },
      { word: 'Gather', definition: 'Tụ tập, sum họp' }
    ],
    adjectives: [
      { word: 'Traditional', definition: 'Thuộc về truyền thống' },
      { word: 'Religious', definition: 'Thuộc về tôn giáo' },
      { word: 'Annual', definition: 'Hàng năm' },
      { word: 'Crowded', definition: 'Đông đúc' },
      { word: 'Special', definition: 'Đặc biệt' }
    ],
    phrases: [
      { word: 'Take place', definition: 'Diễn ra' },
      { word: 'Look forward to', definition: 'Mong chờ' },
      { word: 'Dress up', definition: 'Ăn diện / Hóa trang' },
      { word: 'Blow out (candles)', definition: 'Thổi tắt (nến)' }
    ],
    structures: [
      { 
        pattern: "S + usually + V (Present Simple)", 
        explanation: "Thói quen hoặc phong tục", 
        example: "People usually visit pagodas on Tet holiday." 
      },
      { 
        pattern: "S + is/are used to + V-ing", 
        explanation: "Quen với việc gì", 
        example: "We are used to eating with chopsticks." 
      },
      { 
        pattern: "I suggest that we should + V", 
        explanation: "Gợi ý làm gì", 
        example: "I suggest that we should wear traditional clothes." 
      }
    ],
    modelSentences: [
      { english: "Tet is the most important traditional festival in Vietnam.", vietnamese: "Tết là lễ hội truyền thống quan trọng nhất ở Việt Nam." },
      { english: "During the festival, people decorate their houses with flowers and lights.", vietnamese: "Trong lễ hội, mọi người trang trí nhà cửa bằng hoa và đèn." },
      { english: "It is a custom to give lucky money to children.", vietnamese: "Tặng tiền lì xì cho trẻ em là một phong tục." }
    ]
  },
  {
    id: 'history',
    name: 'History (Module 3)',
    icon: '🏛️',
    description: 'Historical figures, old buildings, museums, and past events.',
    nouns: [
      { word: 'Century', definition: 'Thế kỷ' },
      { word: 'Statue', definition: 'Bức tượng' },
      { word: 'Monument', definition: 'Đài tưởng niệm' },
      { word: 'Castle', definition: 'Lâu đài' },
      { word: 'Ancestor', definition: 'Tổ tiên' },
      { word: 'Exhibition', definition: 'Triển lãm' },
      { word: 'Battle', definition: 'Trận chiến' }
    ],
    verbs: [
      { word: 'Discover', definition: 'Khám phá ra' },
      { word: 'Invent', definition: 'Phát minh' },
      { word: 'Build', definition: 'Xây dựng' },
      { word: 'Destroy', definition: 'Phá hủy' },
      { word: 'Visit', definition: 'Tham quan' }
    ],
    adjectives: [
      { word: 'Ancient', definition: 'Cổ đại' },
      { word: 'Historic', definition: 'Có ý nghĩa lịch sử' },
      { word: 'Famous', definition: 'Nổi tiếng' },
      { word: 'Modern', definition: 'Hiện đại' }
    ],
    phrases: [
      { word: 'Date back to', definition: 'Có niên đại từ' },
      { word: 'Used to + V', definition: 'Đã từng (làm gì trong quá khứ)' },
      { word: 'Go back in time', definition: 'Quay ngược thời gian' }
    ],
    structures: [
      { 
        pattern: "Passive Voice: S + was/were + V3 (built/invented) + by...", 
        explanation: "Câu bị động quá khứ", 
        example: "The temple was built in the 11th century." 
      },
      { 
        pattern: "S + used to + V", 
        explanation: "Thói quen trong quá khứ nay không còn", 
        example: "People used to travel by horse." 
      },
      { 
        pattern: "While S + was + V-ing, S + V-ed", 
        explanation: "Hành động đang xảy ra thì hành động khác xen vào", 
        example: "While they were digging, they found an old coin." 
      }
    ],
    modelSentences: [
      { english: "We visited the museum to see the dinosaur skeletons.", vietnamese: "Chúng tôi đã thăm bảo tàng để xem bộ xương khủng long." },
      { english: "This castle was built hundreds of years ago by a king.", vietnamese: "Lâu đài này được xây dựng hàng trăm năm trước bởi một vị vua." },
      { english: "Learning history helps us understand our culture better.", vietnamese: "Học lịch sử giúp chúng ta hiểu văn hóa của mình tốt hơn." }
    ]
  },
  {
    id: 'transport',
    name: 'Transport (Module 4)',
    icon: '🚌',
    description: 'Public transport, cars, travel, and traffic issues.',
    nouns: [
      { word: 'Public transport', definition: 'Giao thông công cộng' },
      { word: 'Vehicle', definition: 'Phương tiện' },
      { word: 'Traffic jam', definition: 'Tắc đường' },
      { word: 'Fare', definition: 'Giá vé (tàu, xe)' },
      { word: 'Passenger', definition: 'Hành khách' },
      { word: 'Destination', definition: 'Điểm đến' },
      { word: 'Journey', definition: 'Chuyến đi (thường là dài)' }
    ],
    verbs: [
      { word: 'Commute', definition: 'Đi làm (đường xa)' },
      { word: 'Delay', definition: 'Hoãn lại' },
      { word: 'Depart', definition: 'Khởi hành' },
      { word: 'Arrive', definition: 'Đến nơi' },
      { word: 'Board', definition: 'Lên (tàu, xe, máy bay)' }
    ],
    adjectives: [
      { word: 'Crowded', definition: 'Đông đúc' },
      { word: 'Cheap', definition: 'Rẻ' },
      { word: 'Expensive', definition: 'Đắt' },
      { word: 'Reliable', definition: 'Đáng tin cậy' },
      { word: 'Private', definition: 'Riêng tư (xe cá nhân)' }
    ],
    phrases: [
      { word: 'Get on / Get off', definition: 'Lên xe / Xuống xe' },
      { word: 'Pick up', definition: 'Đón ai đó' },
      { word: 'Drop off', definition: 'Thả ai đó xuống' },
      { word: 'Go by car/bus', definition: 'Đi bằng xe hơi/buýt' },
      { word: 'On foot', definition: 'Đi bộ' }
    ],
    structures: [
      { 
        pattern: "I prefer + V-ing + to + V-ing", 
        explanation: "Thích làm gì hơn làm gì", 
        example: "I prefer taking the bus to driving a car." 
      },
      { 
        pattern: "It takes (me) + [time] + to + V", 
        explanation: "Mất bao lâu để làm gì", 
        example: "It takes me 30 minutes to get to school." 
      },
      { 
        pattern: "The best way to travel is...", 
        explanation: "So sánh nhất", 
        example: "The best way to travel around the city is by metro." 
      }
    ],
    modelSentences: [
      { english: "Traffic jams are a major problem in big cities during rush hour.", vietnamese: "Tắc đường là vấn đề lớn ở các thành phố lớn trong giờ cao điểm." },
      { english: "Using public transport is cheaper and more eco-friendly than driving.", vietnamese: "Sử dụng giao thông công cộng rẻ hơn và thân thiện với môi trường hơn lái xe." },
      { english: "My flight was delayed for two hours because of the bad weather.", vietnamese: "Chuyến bay của tôi bị hoãn 2 tiếng do thời tiết xấu." }
    ]
  },
  {
    id: 'environment',
    name: 'Environment (Module 5)',
    icon: '🌱',
    description: 'Pollution, recycling, climate change, and protecting nature.',
    nouns: [
      { word: 'Pollution', definition: 'Ô nhiễm (air, water, noise)' },
      { word: 'Climate change', definition: 'Biến đổi khí hậu' },
      { word: 'Global warming', definition: 'Sự nóng lên toàn cầu' },
      { word: 'Fossil fuels', definition: 'Nhiên liệu hóa thạch (coal, oil)' },
      { word: 'Renewable energy', definition: 'Năng lượng tái tạo' },
      { word: 'Waste', definition: 'Rác thải' },
      { word: 'Litter', definition: 'Rác xả bừa bãi' }
    ],
    verbs: [
      { word: 'Protect', definition: 'Bảo vệ' },
      { word: 'Recycle', definition: 'Tái chế' },
      { word: 'Destroy', definition: 'Phá hủy' },
      { word: 'Reduce', definition: 'Giảm bớt' },
      { word: 'Reuse', definition: 'Tái sử dụng' },
      { word: 'Damage', definition: 'Gây hại' }
    ],
    adjectives: [
      { word: 'Harmful', definition: 'Có hại', example: 'Plastic is harmful to the ocean.' },
      { word: 'Eco-friendly', definition: 'Thân thiện với môi trường' },
      { word: 'Sustainable', definition: 'Bền vững' },
      { word: 'Clean', definition: 'Sạch sẽ' }
    ],
    phrases: [
      { word: 'Cut down on', definition: 'Cắt giảm (sử dụng cái gì đó)', example: 'We should cut down on plastic.' },
      { word: 'Throw away', definition: 'Vứt đi' },
      { word: 'Run out of', definition: 'Cạn kiệt' },
      { word: 'Make a difference', definition: 'Tạo ra sự thay đổi tích cực' }
    ],
    structures: [
      { 
        pattern: "It is essential/crucial to + V", 
        explanation: "Dùng để nhấn mạnh tầm quan trọng của hành động", 
        example: "It is crucial to recycle paper." 
      },
      { 
        pattern: "If we don't + V, S + will + V", 
        explanation: "Câu điều kiện loại 1 (Cảnh báo hậu quả)", 
        example: "If we don't reduce waste, the ocean will be full of plastic." 
      },
      { 
        pattern: "S + should + V / S + ought to + V", 
        explanation: "Khuyên nên làm gì", 
        example: "We should use reusable bags." 
      }
    ],
    modelSentences: [
      { english: "We should use public transport instead of cars to reduce air pollution.", vietnamese: "Chúng ta nên dùng phương tiện công cộng thay vì xe hơi để giảm ô nhiễm không khí." },
      { english: "Recycling paper and plastic helps to save natural resources.", vietnamese: "Tái chế giấy và nhựa giúp tiết kiệm tài nguyên thiên nhiên." },
      { english: "The government needs to pass laws to stop factories from polluting rivers.", vietnamese: "Chính phủ cần thông qua luật để ngăn chặn các nhà máy làm ô nhiễm sông ngòi." }
    ]
  },
  {
    id: 'health',
    name: 'Health & Fitness (Module 6)',
    icon: '🏃',
    description: 'Sports, diet, illness, and healthy lifestyle choices.',
    nouns: [
      { word: 'Diet', definition: 'Chế độ ăn uống' },
      { word: 'Exercise', definition: 'Bài tập thể dục' },
      { word: 'Obesity', definition: 'Béo phì' },
      { word: 'Mental health', definition: 'Sức khỏe tinh thần' },
      { word: 'Ingredient', definition: 'Thành phần (món ăn)' },
      { word: 'Recipe', definition: 'Công thức nấu ăn' },
      { word: 'Flu', definition: 'Cúm' }
    ],
    verbs: [
      { word: 'Avoid', definition: 'Tránh xa' },
      { word: 'Improve', definition: 'Cải thiện' },
      { word: 'Recover', definition: 'Hồi phục' },
      { word: 'Suffer from', definition: 'Chịu đựng (bệnh gì)', example: 'Suffer from a headache' }
    ],
    adjectives: [
      { word: 'Healthy', definition: 'Khỏe mạnh / Lành mạnh' },
      { word: 'Nutritious', definition: 'Nhiều dinh dưỡng' },
      { word: 'Stressful', definition: 'Căng thẳng' },
      { word: 'Overweight', definition: 'Thừa cân' },
      { word: 'Fit', definition: 'Cân đối, khỏe mạnh' }
    ],
    phrases: [
      { word: 'Keep fit', definition: 'Giữ dáng' },
      { word: 'Lose weight', definition: 'Giảm cân' },
      { word: 'Work out', definition: 'Tập thể dục' },
      { word: 'Get rid of', definition: 'Loại bỏ', example: 'Get rid of bad habits' },
      { word: 'Take up', definition: 'Bắt đầu chơi (môn thể thao)', example: 'I took up yoga.' }
    ],
    structures: [
      { 
        pattern: "In order to + V, you should...", 
        explanation: "Để làm gì đó, bạn nên...", 
        example: "In order to lose weight, you should eat fewer sweets." 
      },
      { 
        pattern: "S + suggest + V-ing / S + suggest + (that) S + (should) V", 
        explanation: "Gợi ý làm gì", 
        example: "I suggest drinking more water every day." 
      },
      { 
        pattern: "It is important to maintain a balanced diet.", 
        explanation: "Cấu trúc 'It is important to...'", 
        example: "It is important to get enough sleep." 
      }
    ],
    modelSentences: [
      { english: "Regular exercise is the key to a healthy lifestyle.", vietnamese: "Tập thể dục thường xuyên là chìa khóa cho lối sống lành mạnh." },
      { english: "You should avoid eating too much fast food because it contains a lot of fat.", vietnamese: "Bạn nên tránh ăn quá nhiều đồ ăn nhanh vì nó chứa nhiều chất béo." },
      { english: "Playing sports helps you keep fit and reduces stress.", vietnamese: "Chơi thể thao giúp bạn giữ dáng và giảm căng thẳng." }
    ]
  }
];
