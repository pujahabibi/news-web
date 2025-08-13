const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { name: 'Technology' },
        update: {},
        create: {
          name: 'Technology',
          description: 'Latest technology news and innovations'
        }
      }),
      prisma.category.upsert({
        where: { name: 'Business' },
        update: {},
        create: {
          name: 'Business',
          description: 'Business and finance news'
        }
      }),
      prisma.category.upsert({
        where: { name: 'Science' },
        update: {},
        create: {
          name: 'Science',
          description: 'Scientific discoveries and research'
        }
      }),
      prisma.category.upsert({
        where: { name: 'Sports' },
        update: {},
        create: {
          name: 'Sports',
          description: 'Sports news and updates'
        }
      })
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // Create sample articles
    const articles = await Promise.all([
      prisma.article.create({
        data: {
          title: 'Revolutionary AI Technology Transforms Healthcare',
          summary: 'New artificial intelligence breakthrough promises to revolutionize medical diagnosis and treatment.',
          content: 'A groundbreaking artificial intelligence system developed by researchers has shown remarkable promise in transforming healthcare delivery. The system uses advanced machine learning algorithms to analyze medical data with unprecedented accuracy.\n\nThe technology has been tested in several hospitals and has demonstrated the ability to detect diseases earlier than traditional methods. Early detection is crucial for successful treatment outcomes, and this AI system could save countless lives.\n\nDoctors who have used the system report that it significantly reduces the time needed for diagnosis while improving accuracy. The system can analyze complex medical images, lab results, and patient history to provide comprehensive insights.\n\nThe research team is now working on expanding the system\'s capabilities to cover more medical conditions. They expect the technology to be widely available within the next two years.',
          author: 'Dr. Sarah Johnson',
          categoryId: categories[0].id,
          likes: 45,
          views: 1250
        }
      }),
      prisma.article.create({
        data: {
          title: 'Global Markets Show Strong Recovery Signs',
          summary: 'International financial markets demonstrate resilience as economies bounce back from recent challenges.',
          content: 'Global financial markets are showing strong signs of recovery after a period of uncertainty. Major stock indices across different continents have posted significant gains over the past quarter.\n\nExperts attribute this positive trend to several factors, including improved consumer confidence, strong corporate earnings, and supportive government policies. The technology sector has been particularly strong, leading the recovery with impressive growth numbers.\n\nCentral banks around the world have maintained accommodative monetary policies, which has helped support market liquidity and investor sentiment. This coordinated approach has been crucial in maintaining stability during volatile periods.\n\nAnalysts remain cautiously optimistic about the future, noting that while current trends are positive, investors should remain vigilant about potential risks and market fluctuations.',
          author: 'Michael Chen',
          categoryId: categories[1].id,
          likes: 32,
          views: 890
        }
      }),
      prisma.article.create({
        data: {
          title: 'Breakthrough in Renewable Energy Storage',
          summary: 'Scientists develop new battery technology that could solve renewable energy storage challenges.',
          content: 'Researchers at leading universities have made a significant breakthrough in renewable energy storage technology. The new battery system promises to store solar and wind energy more efficiently than ever before.\n\nThe innovative technology uses advanced materials that allow for higher energy density and longer storage duration. This could address one of the main challenges facing renewable energy adoption - the ability to store energy for use when the sun isn\'t shining or the wind isn\'t blowing.\n\nLaboratory tests have shown that the new batteries can store energy for weeks without significant degradation. This represents a major improvement over current battery technology, which typically loses charge over much shorter periods.\n\nThe research team is now working with industry partners to scale up production. They estimate that commercial versions of the battery could be available within five years, potentially transforming the renewable energy landscape.',
          author: 'Prof. Emma Rodriguez',
          categoryId: categories[2].id,
          likes: 67,
          views: 1520
        }
      }),
      prisma.article.create({
        data: {
          title: 'Championship Finals Draw Record Viewership',
          summary: 'The most watched sporting event of the year delivers excitement and breaks viewing records.',
          content: 'This year\'s championship finals have shattered viewership records, with millions of fans tuning in from around the world. The thrilling competition lived up to all expectations and delivered one of the most exciting finales in recent memory.\n\nThe match featured outstanding performances from both teams, with several record-breaking individual achievements. Fans were treated to incredible displays of skill, strategy, and sportsmanship throughout the competition.\n\nSocial media engagement reached unprecedented levels during the event, with hashtags trending globally and millions of posts shared across platforms. The digital engagement complemented the traditional viewership numbers, showing the event\'s broad appeal.\n\nSponsors and broadcasters are celebrating the success, which has reinforced the championship\'s position as one of the premier sporting events globally. Plans are already underway for next year\'s competition, with expectations set even higher.',
          author: 'Alex Thompson',
          categoryId: categories[3].id,
          likes: 89,
          views: 2340
        }
      }),
      prisma.article.create({
        data: {
          title: 'New Smartphone Features Redefine Mobile Experience',
          summary: 'Latest smartphone innovations introduce features that change how we interact with mobile devices.',
          content: 'The latest generation of smartphones introduces revolutionary features that are set to redefine the mobile experience. Advanced camera systems, improved battery life, and innovative user interfaces are just some of the highlights.\n\nThe new camera technology uses computational photography to capture stunning images in any lighting condition. Users can now take professional-quality photos without needing extensive photography knowledge or equipment.\n\nBattery technology has also seen significant improvements, with new devices offering all-day usage even with intensive applications. Fast charging capabilities mean users can quickly power up their devices when needed.\n\nThe user interface innovations include gesture controls and voice commands that make interacting with devices more intuitive. These features are designed to make smartphones more accessible to users of all ages and technical backgrounds.',
          author: 'Lisa Park',
          categoryId: categories[0].id,
          likes: 123,
          views: 2890
        }
      })
    ]);

    console.log(`✅ Created ${articles.length} articles`);

    // Create sample comments
    const comments = await Promise.all([
      prisma.comment.create({
        data: {
          content: 'This is fascinating! The potential applications in healthcare are enormous.',
          author: 'Dr. Mark Wilson',
          email: 'mark.wilson@email.com',
          articleId: articles[0].id
        }
      }),
      prisma.comment.create({
        data: {
          content: 'Great analysis of the market trends. Looking forward to seeing how this develops.',
          author: 'Jennifer Smith',
          email: 'jennifer.smith@email.com',
          articleId: articles[1].id
        }
      }),
      prisma.comment.create({
        data: {
          content: 'Finally, a solution to the renewable energy storage problem! This could be a game changer.',
          author: 'Robert Green',
          email: 'robert.green@email.com',
          articleId: articles[2].id
        }
      }),
      prisma.comment.create({
        data: {
          content: 'What an incredible match! The excitement was off the charts.',
          author: 'Sports Fan',
          email: 'fan@sports.com',
          articleId: articles[3].id
        }
      })
    ]);

    console.log(`✅ Created ${comments.length} comments`);
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});