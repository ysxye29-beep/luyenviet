
import { PdfTask, TaskType } from '../types';

export const PDF_TASKS: PdfTask[] = [
  // --- PART 1: INFORMAL LETTERS ---
  {
    id: 'pdf-letter-allie',
    title: 'Letter to Allie (Flat Information)',
    type: TaskType.InformalLetter,
    content: `You received a letter from your English friend, Allie. She asked you for some information about your flat. Read part of her letter below.\n\n"I am going to take a two-year intensive course in Vietnamese language in Hanoi next month. I want to look for an apartment near the university. My friend said that you have a flat for rent. Can you tell me a bit about your flat (things like the number of rooms, its special features, the price and the neighborhood)? I want to see if the flat will be suitable for me."\n\nWrite a letter responding to Allie.`,
    sampleAnswer: `Hi Allie,

It’s great to hear from you! I’m so happy that you are coming to Hanoi to study Vietnamese next month.

Regarding the flat, it’s located on the third floor of a small building just 500 meters from your university, so you can easily walk to class. It has one bedroom, a cozy living room, and a small kitchen. 

The best feature is definitely the balcony which looks over a quiet park. It’s perfect for relaxing after school. The rent is $300 per month, which includes water and internet. As for the neighborhood, it is very safe and there are many convenience stores nearby.

Let me know if you are interested so I can save it for you.

See you soon,
[Your Name]`
  },
  {
    id: 'pdf-letter-mike',
    title: 'Email to Mike (Festival Info)',
    type: TaskType.InformalLetter,
    content: `You received an email from your English friend, Mike. He asked you for some information about a festival in your country. Read part of his email below.\n\n"I have taken a course on Vietnamese and I am so interested in your culture. I am planning a visit to your country next year. I hope I can take part in one of your festivals. Can you recommend one for me? It’s best if you can tell me when and where the festival takes place so I can book plane tickets in advance. I also want to know about the weather and the activities I can do there."\n\nWrite an email responding to Mike.`,
    sampleAnswer: `Hi Mike,

I’m thrilled to hear that you are planning to visit Vietnam next year! There are many wonderful festivals here, but I highly recommend you experience the Tet Holiday (Lunar New Year).

It usually takes place in late January or early February throughout the whole country. The weather at that time is typically cool and pleasant, especially in the north, so you should bring a light jacket.

During Tet, you can watch colorful fireworks, see dragon dances in the streets, and try traditional foods like Banh Chung. Everyone decorates their houses with peach blossoms, which is really beautiful. It’s a time for family reunions, so the atmosphere is very warm and welcoming.

I hope you can come and enjoy it with us!

Best wishes,
[Your Name]`
  },
  {
    id: 'pdf-letter-jane-health',
    title: 'Email to Jane (Health Advice)',
    type: TaskType.InformalLetter,
    content: `You received an email from your English friend, Jane. She asked you for some information about ways to have good health. Read part of the email below.\n\n"Hi. How is it going? I’ve attended a sport club at my university. How about you? Do you often play sports? Tell me how you keep fit and healthy?"\n\nWrite an email responding to Jane.`,
    sampleAnswer: `Hi Jane,

Thanks for your email. I’m doing well, and it’s great to hear that you’ve joined a sports club!

As for me, I try to play badminton twice a week with my brother in the park near my house. It really helps me reduce stress after school. Besides playing sports, I also pay attention to my diet to keep fit. I try to eat a lot of fresh vegetables and avoid fast food because it contains too much fat.

Also, getting enough sleep is very important to me. I usually try to go to bed before 11 pm to have enough energy for the next day.

What about you? What sport do you play at your club?

Write back soon,
[Your Name]`
  },
  {
    id: 'pdf-letter-jane-friends',
    title: 'Email to Jane (Describing a Friend)',
    type: TaskType.InformalLetter,
    content: `You received an email from your English friend, Jane. She asked you for some information about one of your friends. Read part of her email below.\n\n"I’ve just got an email from your friend, An. She said she’s going to take a course in London this summer. She asked if she could stay with my family until she could find an apartment. Can you tell me a bit about her (things like personality, hobbies and interests, her current work or study if possible)? I want to see if she will fit in with my family."\n\nWrite an email responding to Jane.`,
    sampleAnswer: `Hi Jane,

Thanks for writing to me. It is very kind of you to consider hosting An. I’m sure you will get along very well!

An is one of my closest friends. She is currently a graphic design student at my university. She is extremely friendly, polite, and tidy, so she will definitely respect your house rules.

In her free time, she loves painting and cooking. She actually cooks Vietnamese food very well, so maybe she can make some traditional dishes for your family! She is also keen on learning about British culture, which is why she is going to London.

I really hope you can let her stay with you for a few weeks.

Best regards,
[Your Name]`
  },
  {
    id: 'pdf-letter-susan',
    title: 'Email to Susan (Trip Advice)',
    type: TaskType.InformalLetter,
    content: `You received an email from your English friend, Susan. She told you about her two week trip to Vietnam and asked for some advice. Read part of her email below.\n\n"I’m so excited about my trip because it’s the first time come to Vietnam, Can you tell m about the weather now in Vietnam? what kinds of clothes should bring? where should i stay? What are some interesting places I should visit? What kind of food i should try? What souvernirs i should buy for my parents and my youngest sister?"\n\nWrite an email responding to Susan.`,
    sampleAnswer: `Hi Susan,

I’m so excited that you are coming to Vietnam!

The weather right now is quite hot and humid, so you should bring light, comfortable clothes like T-shirts and shorts. Don't forget your sunglasses and sunscreen too!

For accommodation, I suggest staying in the Old Quarter in Hanoi because it is close to many tourist attractions. You should definitely visit Ha Long Bay for the scenery and Hoi An Ancient Town for the lanterns.

Regarding food, you must try Pho and Bun Cha; they are delicious. For souvenirs, you could buy some Vietnamese coffee for your parents and a conical hat or a handmade silk scarf for your sister.

Let me know your flight details!

Love,
[Your Name]`
  },
  {
    id: 'pdf-letter-ann',
    title: 'Email to Ann (Hometown Trip)',
    type: TaskType.InformalLetter,
    content: `This is a part of an email you received from your English- speaking friend, Ann. She asked you for some information for her next trip to your hometown. Read part of her email below.\n\n"I'm planning to visit your hometown next month and I'm really excited about the trip. Can you suggest somewhere to stay and tell me a little bit about what I can do in your hometown and what clothes should I bring?"\n\nWrite an email responding to Ann.`,
    sampleAnswer: `Hi Ann,

I’m delighted to hear you are visiting my hometown next month!

Since my hometown is near the beach, I suggest you stay at the Seaside Hotel. It has a beautiful ocean view and the price is reasonable.

There are plenty of things to do here. You can go swimming in the morning and enjoy fresh seafood at the night market. If you have time, we can visit the old lighthouse together.

Next month the weather will be sunny and windy, so please bring your swimsuit, sandals, and a hat. You won't need any heavy coats.

I can’t wait to show you around!

Best wishes,
[Your Name]`
  },
  {
    id: 'pdf-letter-tom',
    title: 'Email to Tom (City & Hotel Advice)',
    type: TaskType.InformalLetter,
    content: `You received an email from your English-speaking friend, Tom. He asked you for some information and advice about your region. Read part of his email below.\n\n"I am going to spend a two-week holiday in your city this summer. I feel quite worried because I have never been there. Can you tell me a bit about your city as well as give me some advice (things like the hotel or somewhere to stay, what to do and what clothes to bring)? I want to prepare well for this trip and I look forward to seeing you, too."\n\nWrite an email responding to Tom.`,
    sampleAnswer: `Hi Tom,

Don’t worry at all! I’m sure you will have a fantastic time in my city this summer.

My city is famous for its busy streets and delicious street food. It is very lively and modern. For accommodation, I recommend booking a homestay in the city center. It’s cheaper than a hotel and the hosts are usually very helpful.

There is a lot to do here, such as visiting the history museum and walking around the big lake. Since it will be very hot in the summer, you should pack light clothes like shorts and T-shirts. Also, bring a raincoat because we might have sudden showers.

I look forward to meeting you!

Cheers,
[Your Name]`
  },
  {
    id: 'pdf-letter-john',
    title: 'Email to John (Vacation Advice)',
    type: TaskType.InformalLetter,
    content: `You have just receive an email from your foreign friend John. He asked you some information about a vacation in your country. Read part of his email.\n\n"........... I've just decided to come to your country on my next vacation. Can you give me some advice. What is the best time to visit your country. What should I bring and what shouldn't I bring? Where can I visit and what could I do there? Can you recommend some where to live which is comfortable but not too expensive and what do I have to remember when come to your country?"\n\nWrite an email responding to John.`,
    sampleAnswer: `Hi John,

That’s wonderful news!

The best time to visit Vietnam is in the spring (from February to April) when it is not too hot. You should bring comfortable shoes for walking, but you shouldn't bring too much heavy clothing.

I think you should visit Da Nang city. You can relax on the beach and visit the Marble Mountains. It is a very beautiful place. For accommodation, there are many 3-star hotels near the beach that are comfortable and affordable.

One thing to remember is to always ask for the price before you buy anything at the local markets.

I hope you have a great trip!

Best,
[Your Name]`
  },

  // --- PART 2: ESSAYS (Vstep Standard ~250 words) ---
  {
    id: 'pdf-essay-environment',
    title: 'Advantages of Protecting Environment',
    type: TaskType.Essay,
    content: `Write an essay about the advantages of protecting the environment.\nInclude reasons and any relevant examples to support your arguments.\n\nYou should write at least 250 words.`,
    sampleAnswer: `Environmental protection has become a critical global issue in recent years due to increasing pollution and climate change. Protecting our natural world brings numerous significant advantages to both human health and the planet's sustainability.

Firstly, a clean environment ensures better health and quality of life for everyone. Many modern health problems, such as respiratory diseases and skin cancer, are directly linked to environmental degradation. By reducing air and water pollution, we can provide a safer living space for all residents. For example, cities with many parks and trees often have lower rates of asthma because the greenery acts as a natural air filter, removing harmful dust and producing oxygen.

Secondly, environmental conservation is essential for preserving biodiversity. Human activities like deforestation and urban expansion have destroyed the habitats of countless animal and plant species. By protecting forests and oceans, we can save endangered species from extinction and maintain the ecological balance. This is important because every species plays a role in the food chain, and the loss of one can have a domino effect on others.

Finally, taking care of nature helps mitigate the extreme effects of global warming. By investing in renewable energy and reducing carbon emissions, we can prevent natural disasters like floods and droughts from becoming more frequent. This ensures that the next generation will inherit a habitable and prosperous world.

In conclusion, environmental protection is not just a choice but a necessity. It improves public health, preserves the diversity of life, and secures our future. Therefore, it is important for both governments and individuals to cooperate in keeping our planet green.`
  },
  {
    id: 'pdf-essay-transport',
    title: 'Advantages of Public Transport',
    type: TaskType.Essay,
    content: `Many people prefer using private vehicles, but public transport has many benefits. Write an essay to discuss the advantages of using public transport to travel.\n\nYou should write at least 250 words.`,
    sampleAnswer: `In the modern era, transportation is a vital part of our daily lives. While private cars offer convenience, using public transport systems such as buses and trains provides several significant advantages for individuals and society as a whole.

One major benefit of public transport is that it is much more cost-effective than owning a private vehicle. Owning a car involves numerous expenses, including fuel, insurance, parking fees, and regular maintenance. In contrast, the cost of a bus or train ticket is relatively low. For many office workers and students, choosing public transport can save a significant amount of money each month, which can be spent on other essential needs like food or education.

Furthermore, public transport is a more environmentally friendly way to travel. A single bus can carry dozens of passengers, which means fewer cars are on the road. This leads to a substantial reduction in traffic congestion and exhaust fumes, helping to improve air quality in crowded cities. For instance, cities with highly developed metro systems often experience lower levels of smog compared to those that rely heavily on private automobiles.

Another advantage is that public transport allows commuters to use their time more efficiently. Instead of focusing on driving through heavy traffic, passengers can read, study, or even work on their laptops while they travel. This can help reduce the stress associated with daily commuting and makes the journey more productive.

In conclusion, public transport is not only an economical choice but also a key factor in protecting the environment and improving personal productivity. To encourage more people to use these services, governments should continue to invest in making public transport faster, safer, and more reliable.`
  },
  {
    id: 'pdf-essay-big-city',
    title: 'Drawbacks of Living in a Big City',
    type: TaskType.Essay,
    content: `Living in a big city can be exciting, but it also has several challenges. Write an essay to discuss the drawbacks of living in a big city. Include reasons and relevant examples to support your points.\n\nYou should write at least 250 words.`,
    sampleAnswer: `Urbanization is a global trend, with more and more people moving to metropolises in search of better opportunities. However, while big cities offer many excitements, they also present several serious drawbacks that can negatively affect a person's quality of life.

The most prominent disadvantage is the high level of pollution. Large cities are often characterized by heavy traffic and concentrated industrial zones, leading to severe air and noise pollution. Constant exposure to car exhaust and the loud sounds of construction can result in health problems such as respiratory diseases, hearing loss, and chronic stress. For example, residents in highly populated areas like Tokyo or New York often struggle with poor air quality during peak seasons.

Another significant drawback is the high cost of living. Housing prices, food, and essential services in cities are typically much more expensive than in rural areas or small towns. Many young workers find it difficult to save money because a large portion of their income goes toward renting a small apartment or paying for transportation. This financial pressure can lead to a lower standard of living for those who cannot afford the expensive lifestyle that big cities demand.

Finally, the fast-paced and crowded nature of city life can lead to social isolation and safety concerns. Despite being surrounded by millions of people, many urban residents feel lonely because they lack a strong sense of community. Moreover, crime rates tend to be higher in large cities, making some neighborhoods feel unsafe for families.

To sum up, while big cities provide many career and entertainment options, they come with significant costs. Pollution, expensive living standards, and the lack of social connection are major challenges that city dwellers must face. Therefore, individuals should carefully weigh these pros and cons before deciding to move to a large metropolis.`
  },
  {
    id: 'pdf-essay-smartphone',
    title: 'Problems Caused by Smartphones',
    type: TaskType.Essay,
    content: `Write a paragraph discussing the problems that are caused by young generation using smart phone too much.\n\nWrite 100-150 words.`,
    sampleAnswer: `The overuse of smartphones among the young generation is causing several serious problems.

Firstly, it leads to health issues. Looking at screens for too long can damage eyesight and cause headaches. Moreover, teenagers often stay up late using their phones, which results in a lack of sleep and tiredness the next day.

Secondly, excessive smartphone use affects social skills. Many young people prefer chatting online to meeting friends face-to-face. Consequently, they may feel lonely or struggle to communicate in real life. Finally, it distracts students from their studies, leading to poor grades.

To solve this, young people should limit their screen time and spend more time on outdoor activities.`
  },
  {
    id: 'pdf-essay-work-life',
    title: 'Solutions for Work-Life Balance',
    type: TaskType.Essay,
    content: `A significant portion of the population experiences stress and burnout due to demanding work schedules. What steps can employers take to foster a healthier work-life balance and reduce workplace stress?\nWrite a paragraph providing solutions to this problem.\n\nWrite 100-150 words.`,
    sampleAnswer: `Employers can take several steps to help employees achieve a better work-life balance and reduce stress.

One effective solution is to offer flexible working hours. Allowing employees to choose when they start and finish work, or letting them work from home a few days a week, can help them manage their personal responsibilities better.

Another measure is to encourage regular breaks and holidays. Companies should ensure that staff take their annual leave to rest and recharge. Furthermore, employers can organize wellness activities, such as yoga classes or team-building trips, to improve mental health.

By implementing these measures, companies can create a happier and more productive workforce.`
  },
  {
    id: 'pdf-essay-health-fitness',
    title: 'Solutions for Decreasing Health',
    type: TaskType.Essay,
    content: `In some countries the average weight of people is increasing, and their levels of health and fitness are decreasing. What measures could governments and authorities take to solve these problems?\nWrite an essay to provide solutions to this trend.\n\nYou should write at least 250 words.`,
    sampleAnswer: `Recent studies have shown a worrying trend in many parts of the world where public health is declining while obesity rates are climbing. This phenomenon is largely driven by inactive lifestyles and the prevalence of processed foods. To address this crisis, governments and local authorities must implement a series of robust measures focusing on education, regulation, and infrastructure.

Firstly, one of the most effective solutions is for the government to invest in large-scale public education campaigns. These campaigns should aim to raise awareness about the long-term dangers of obesity, such as diabetes and heart disease, and provide practical advice on maintaining a balanced diet. By educating children in schools about nutrition, we can ensure that the next generation develops healthier eating habits from an early age.

Secondly, authorities should consider using regulatory tools to discourage the consumption of unhealthy products. For example, a "sugar tax" on fizzy drinks and high-calorie snacks has proven effective in several countries by making junk food more expensive and less attractive to consumers. Additionally, governments could tighten regulations on food advertising, particularly those targeting children, to prevent the promotion of low-quality snacks and fast food.

Finally, improvements in urban infrastructure are essential to encourage physical activity. Governments should invest in building more public parks, cycle lanes, and free sports facilities. If citizens have easy and safe access to places where they can exercise, they are more likely to incorporate physical activity into their daily routines. Encouraging people to walk or cycle to work instead of driving can significantly improve the overall fitness levels of the population.

In conclusion, the problem of declining health and rising weight is a complex issue but can be solved through a combination of education, taxation, and improved urban planning. When governments take proactive steps to foster a healthier environment, citizens are better equipped to lead more active and wholesome lives.`
  },
  {
    id: 'pdf-essay-university',
    title: 'Reasons for Going to University',
    type: TaskType.Essay,
    content: `Write a paragraph about the reasons why people go to university.\nInclude reasons and any relevant examples to support your answer.\n\nWrite 100-150 words.`,
    sampleAnswer: `There are several important reasons why many students choose to go to university.

The main reason is to improve their career prospects. A university degree is often required for high-paying jobs in fields like medicine, engineering, or law. Graduates usually have better opportunities to get promoted than those without a degree.

Another reason is personal growth. University life teaches students how to be independent, manage their time, and solve problems. It is also a great place to meet new people and build a professional network.

In summary, people go to university not only to get a good job but also to develop themselves and expand their knowledge.`
  },
  {
    id: 'pdf-essay-obesity',
    title: 'Causes and Effects of Obesity',
    type: TaskType.Essay,
    content: `Childhood obesity is becoming a serious problem in many countries. Explain the main causes and effects of this problem, and suggest some possible solutions.\n\nWrite about 100-150 words.`,
    sampleAnswer: `Childhood obesity is a growing concern with several causes and serious effects.

The primary cause is an unhealthy diet. Many children consume too much fast food and sugary drinks. In addition, a lack of exercise contributes to the problem, as children spend hours playing video games instead of playing outside.

The effects are alarming. Obese children often suffer from health issues like diabetes and heart problems. They may also face bullying at school, which affects their mental confidence.

To solve this, parents should prepare healthy meals at home and limit screen time. Schools should also provide more physical activities to keep children active.`
  },
  {
    id: 'pdf-essay-traffic',
    title: 'Causes and Solutions for Traffic Jams',
    type: TaskType.Essay,
    content: `Traffic jams are becoming a huge problem for many major cities. Effort has been made to cope with it, for example, the construction of new bridges, the situation seems not to change much.\nWrite an essay to discuss the causes of traffic jams and suggest some solutions.\n\nWrite at least 150 words.`,
    sampleAnswer: `Traffic congestion is a major issue in modern cities, caused by several factors, but there are solutions to mitigate it.

One main cause is the increasing number of private vehicles. Most people prefer driving their own cars or motorbikes because it is convenient. Additionally, the road infrastructure in many cities is outdated and too narrow to handle the volume of traffic during rush hours.

To solve this problem, the government should invest more in public transport systems like buses and metros. If public transport is fast and reliable, more people will leave their cars at home. Another solution is to encourage cycling by building dedicated bike lanes. Finally, companies could allow employees to work from home to reduce the number of commuters.

In conclusion, improving public transport and flexible working hours can help reduce traffic jams.`
  },
  {
    id: 'pdf-essay-internet',
    title: 'Advantages of the Internet',
    type: TaskType.Essay,
    content: `Nowadays a huge number of people use the Internet to collect information. While there are many advantages of finding information on the Internet, people also find it hard to find reliable information online.\nWrite an essay to discuss the advantages and disadvantages of collecting information on the Internet.\n\nWrite at least 150 words.`,
    sampleAnswer: `The Internet has revolutionized the way we access information, but it comes with both pros and cons.

On the one hand, the Internet is incredibly convenient. With just a few clicks, we can find answers to almost any question instantly. It provides access to a vast amount of knowledge, from educational videos to research papers, which is very helpful for students and workers.

On the other hand, the reliability of online information is a big issue. Anyone can post on the Internet, so there is a lot of fake news and inaccurate data. People often struggle to distinguish between trustworthy sources and false information.

In conclusion, while the Internet is a powerful tool for learning, users must be careful and verify the information they find.`
  },
  {
    id: 'pdf-essay-air-pollution',
    title: 'Air Pollution Caused by Deforestation',
    type: TaskType.Essay,
    content: `Topic: Air pollution caused by deforestation.\nWrite a paragraph discussing this problem based on main ideas:\n1. Air pollution is a serious problem.\n2. Deforestation is a major cause.\n3. Government role.\n4. Individual responsibility.\n5. Cooperation is the best solution.\n\nWrite 100-150 words.`,
    sampleAnswer: `Air pollution is becoming a serious global problem, threatening human health and the environment. One of the major causes of this issue is deforestation. Trees act as natural filters that absorb carbon dioxide and release oxygen. When forests are cut down for farming or construction, this natural cleaning process stops, leading to dirtier air.

To tackle this, the government plays a crucial role. They must pass strict laws to ban illegal logging and plant more forests. However, individuals also have a responsibility. We can help by using less paper and supporting eco-friendly products.

In conclusion, cooperation between the government and individuals is the best solution to stop deforestation and improve air quality.`
  },
  {
    id: 'pdf-essay-multitasking',
    title: 'Advantages and Disadvantages of Multitasking',
    type: TaskType.Essay,
    content: `Write a paragraph about the advantages and disadvantages of multitasking (doing many tasks at the same time).\n\nWrite 100-150 words.`,
    sampleAnswer: `Multitasking is common in modern life, but it has both benefits and drawbacks.

The main advantage is that it helps save time in the short run. For example, listening to the news while cooking dinner allows you to do two useful things at once. It can make people feel more productive and active.

However, the disadvantage is that it often reduces the quality of work. When the brain focuses on too many things, people are more likely to make mistakes. Furthermore, multitasking can cause stress and fatigue because the brain does not have time to rest.

To sum up, while multitasking can be useful for simple chores, it is better to focus on one thing at a time for important tasks.`
  },
  {
    id: 'pdf-essay-computer-games',
    title: 'Impacts of Playing Computer Games',
    type: TaskType.Essay,
    content: `Nowadays many people have access to computers on a wide basis and a large number of children play computer games.\nWhat are the positive and negative impacts of playing computer games and what can be done to minimize the bad effects?\n\nWrite about 100-150 words.`,
    sampleAnswer: `Playing computer games has become a popular hobby, but it has both positive and negative impacts on children.

On the positive side, games can improve logic and problem-solving skills. Some games also require teamwork, which helps children learn how to cooperate with others.

On the negative side, excessive gaming can lead to addiction. Children may neglect their homework and outdoor activities. Sitting in front of a screen for too long also causes health problems like eye strain and obesity.

To minimize the bad effects, parents should limit playing time to one hour a day. They should also encourage children to play sports or read books to ensure a balanced lifestyle.`
  }
];
