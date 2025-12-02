import { Sun, Coffee, Music, Users, BookOpen } from 'lucide-react';

export const mockDB = {
    // ... existing sermons, events, blogs, departments ...
    sermons: [
        { id: 1, title: "Reach Higher", preacher: "Pastor Michael Ford", date: "2023-10-22", series: "Limitless", image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800", videoUrl: "#" },
        { id: 2, title: "The Art of Neighboring", preacher: "Pastor Sarah Jenkins", date: "2023-10-15", series: "Community", image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800", videoUrl: "#" },
        { id: 3, title: "Breaking Chains", preacher: "Pastor Michael Ford", date: "2023-10-08", series: "Freedom", image: "https://images.unsplash.com/photo-1445633814773-e687a5de9baa?auto=format&fit=crop&q=80&w=800", videoUrl: "#" },
    ],
    events: [
        { id: 1, title: "City Outreach", date: "Nov 12, 2023", time: "10:00 AM", location: "Downtown Plaza", category: "Outreach" },
        { id: 2, title: "Worship Night: Unbroken", date: "Nov 15, 2023", time: "7:00 PM", location: "Main Sanctuary", category: "Worship" },
        { id: 3, title: "Youth Camp 2023", date: "Dec 10, 2023", time: "All Day", location: "Pine Lake Retreat", category: "Youth" },
    ],
    blogs: [
        { id: 1, title: "Finding Peace in Chaos", author: "Sarah Jenkins", date: "Oct 20, 2023", excerpt: "In a world that never stops, how do we find the stillness God promises?", category: "Discipleship" },
        { id: 2, title: "Generosity as a Lifestyle", author: "Finance Team", date: "Oct 12, 2023", excerpt: "Why giving is less about the wallet and more about the heart.", category: "Stewardship" },
    ],
    departments: [
        { id: 'kids', name: "Reach Kids", icon: <Sun size={32} />, description: "Fun, safe, and faith-filled environments for ages 0-11.", head: "Mary Poppins" },
        { id: 'youth', name: "Apex Youth", icon: <Coffee size={32} />, description: "Empowering teens to own their faith and change the world.", head: "Mike Chang" },
        { id: 'worship', name: "Worship Creative", icon: <Music size={32} />, description: "Leading the congregation in spirit and truth through music.", head: "David Psalm" },
        { id: 'groups', name: "Life Groups", icon: <Users size={32} />, description: "Small groups meeting in homes to do life together.", head: "Sarah Connect" },
        { id: 'library', name: "Book Library", icon: <BookOpen size={32} />, description: "Resources to help you grow in your walk with Christ.", head: "Resource Team" },
    ],
    books: [
        {
            id: 1,
            title: "Purpose Driven Life",
            author: "Rick Warren",
            price: 250.00,
            category: "Spiritual Growth",
            rating: 4.8,
            pages: 368,
            language: "English",
            description: "You are not an accident. Even before the universe was created, God had you in mind, and he planned you for his purposes. These purposes will extend far beyond the few years you will spend on earth.",
            image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 2,
            title: "Mere Christianity",
            author: "C.S. Lewis",
            price: 180.00,
            category: "Apologetics",
            rating: 4.9,
            pages: 227,
            language: "English",
            description: "In the classic Mere Christianity, C.S. Lewis, the most important writer of the 20th century, explores the common ground upon which all of those of Christian faith stand together.",
            image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 3,
            title: "The Meaning of Marriage",
            author: "Timothy Keller",
            price: 300.00,
            category: "Relationships",
            rating: 4.7,
            pages: 330,
            language: "English",
            description: "Based on the acclaimed sermon series by New York Times bestselling author Timothy Keller, this book shows everyone—Christians, skeptics, singles, longtime married couples—the vision of what marriage should be.",
            image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 4,
            title: "Crazy Love",
            author: "Francis Chan",
            price: 220.00,
            category: "Christian Living",
            rating: 4.6,
            pages: 205,
            language: "English",
            description: "God is love. Crazy, relentless, all-powerful love. Have you ever wondered if we're missing it? It's crazy, if you think about it. The God of the universe—the Creator of nitrogen and pine needles, galaxies and E-minor—loves us with a radical, unconditional, self-sacrificing love.",
            image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 5,
            title: "The Case for Christ",
            author: "Lee Strobel",
            price: 275.00,
            category: "Apologetics",
            rating: 4.8,
            pages: 300,
            language: "English",
            description: "A Seasoned Journalist Chases Down the Biggest Story in History. Retracing his own spiritual journey from atheism to faith, Lee Strobel, former legal editor of the Chicago Tribune, cross-examines a dozen experts with doctorates from schools like Cambridge, Princeton, and Brandeis.",
            image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 6,
            title: "Fervent",
            author: "Priscilla Shirer",
            price: 210.00,
            category: "Prayer",
            rating: 4.9,
            pages: 189,
            language: "English",
            description: "You have an enemy . . . and he’s dead set on destroying all you hold dear and keeping you from experiencing abundant life in Christ. What’s more, his approach to disrupting your life and discrediting your faith isn’t general or generic, not a one-size-fits-all. It’s specific.",
            image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&q=80&w=800"
        },
    ],
    gallery: [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800",
    ]
};

export const api = {
    getSermons: () => Promise.resolve(mockDB.sermons),
    getEvents: () => Promise.resolve(mockDB.events),
    getBlogs: () => Promise.resolve(mockDB.blogs),
    getDepartments: () => Promise.resolve(mockDB.departments),
    getGallery: () => Promise.resolve(mockDB.gallery),
    getBooks: () => Promise.resolve(mockDB.books),
    getBook: (id) => Promise.resolve(mockDB.books.find(b => b.id === parseInt(id))),
    submitPrayer: (data) => new Promise((resolve) => {
        console.log("Sending to PHP Backend:", data);
        setTimeout(() => resolve({ success: true, message: "Prayer received" }), 1000);
    })
};