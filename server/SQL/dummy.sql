--
-- Dummy Data for Manga Database (User ID 5 only)
--

-- Insert data into the 'manga' table
INSERT INTO manga (title, original_title, description, author, cover, ratings) VALUES
('Attack on Titan', 'Shingeki no Kyojin', 'Eren Yeager vows to rid the world of the giant humanoid Titans that have brought humanity to the brink of extinction.', 'Hajime Isayama', 'https://example.com/covers/aot.jpg', 9.1),
('Jujutsu Kaisen', 'Jujutsu Kaisen', 'A high school student swallows a cursed object and becomes involved in the world of curses and sorcerers.', 'Gege Akutami', 'https://example.com/covers/jjk.jpg', 8.8),
('Chainsaw Man', 'Chainsaw Man', 'Denji, a poor young man, makes a contract with a Chainsaw Devil and gains the ability to transform his body parts into chainsaws.', 'Tatsuki Fujimoto', 'https://example.com/covers/csm.jpg', 8.9),
('Spy x Family', 'Spy x Family', 'A spy, an assassin, and a telepathic girl come together to form a fake family to achieve their individual goals.', 'Tatsuya Endo', 'https://example.com/covers/sxf.jpg', 8.7),
('One Piece', 'One Piece', 'Monkey D. Luffy and his pirate crew, the Straw Hat Pirates, explore the Grand Line in search of the ultimate treasure known as the "One Piece".', 'Eiichiro Oda', 'https://example.com/covers/onepiece.jpg', 9.3);

-- Insert data into the 'genre' table
INSERT INTO genre (name) VALUES
('Action'),
('Fantasy'),
('Mystery'),
('Adventure'),
('Sci-Fi'),
('Horror'),
('Comedy'),
('Supernatural'),
('Drama'),
('Shonen'),
('Dark Fantasy');

-- Insert data into the 'manga_genre' table
-- Attack on Titan
INSERT INTO manga_genre (manga_ID, genre_ID) VALUES
((SELECT ID FROM manga WHERE title = 'Attack on Titan'), (SELECT ID FROM genre WHERE name = 'Action')),
((SELECT ID FROM manga WHERE title = 'Attack on Titan'), (SELECT ID FROM genre WHERE name = 'Dark Fantasy')),
((SELECT ID FROM manga WHERE title = 'Attack on Titan'), (SELECT ID FROM genre WHERE name = 'Drama'));

-- Jujutsu Kaisen
INSERT INTO manga_genre (manga_ID, genre_ID) VALUES
((SELECT ID FROM manga WHERE title = 'Jujutsu Kaisen'), (SELECT ID FROM genre WHERE name = 'Action')),
((SELECT ID FROM manga WHERE title = 'Jujutsu Kaisen'), (SELECT ID FROM genre WHERE name = 'Supernatural')),
((SELECT ID FROM manga WHERE title = 'Jujutsu Kaisen'), (SELECT ID FROM genre WHERE name = 'Shonen'));

-- Chainsaw Man
INSERT INTO manga_genre (manga_ID, genre_ID) VALUES
((SELECT ID FROM manga WHERE title = 'Chainsaw Man'), (SELECT ID FROM genre WHERE name = 'Action')),
((SELECT ID FROM manga WHERE title = 'Chainsaw Man'), (SELECT ID FROM genre WHERE name = 'Dark Fantasy')),
((SELECT ID FROM manga WHERE title = 'Chainsaw Man'), (SELECT ID FROM genre WHERE name = 'Horror'));

-- Spy x Family
INSERT INTO manga_genre (manga_ID, genre_ID) VALUES
((SELECT ID FROM manga WHERE title = 'Spy x Family'), (SELECT ID FROM genre WHERE name = 'Comedy')),
((SELECT ID FROM manga WHERE title = 'Spy x Family'), (SELECT ID FROM genre WHERE name = 'Action')),
((SELECT ID FROM manga WHERE title = 'Spy x Family'), (SELECT ID FROM genre WHERE name = 'Slice of Life'));

-- One Piece
INSERT INTO manga_genre (manga_ID, genre_ID) VALUES
((SELECT ID FROM manga WHERE title = 'One Piece'), (SELECT ID FROM genre WHERE name = 'Action')),
((SELECT ID FROM manga WHERE title = 'One Piece'), (SELECT ID FROM genre WHERE name = 'Adventure')),
((SELECT ID FROM manga WHERE title = 'One Piece'), (SELECT ID FROM genre WHERE name = 'Fantasy')),
((SELECT ID FROM manga WHERE title = 'One Piece'), (SELECT ID FROM genre WHERE name = 'Shonen'));


-- Insert data into the 'chapter' table
INSERT INTO chapter (manga_ID, number, name) VALUES
((SELECT ID FROM manga WHERE title = 'Attack on Titan'), 1.0, 'To You, 2000 Years From Now'),
((SELECT ID FROM manga WHERE title = 'Attack on Titan'), 2.0, 'That Day'),
((SELECT ID FROM manga WHERE title = 'Jujutsu Kaisen'), 1.0, 'Ryomen Sukuna'),
((SELECT ID FROM manga WHERE title = 'Jujutsu Kaisen'), 2.0, 'For My Own Good'),
((SELECT ID FROM manga WHERE title = 'Chainsaw Man'), 1.0, 'Dog & Chainsaw'),
((SELECT ID FROM manga WHERE title = 'Chainsaw Man'), 2.0, 'The Place Where Pochita Is'),
((SELECT ID FROM manga WHERE title = 'Spy x Family'), 1.0, 'Mission 1'),
((SELECT ID FROM manga WHERE title = 'Spy x Family'), 2.0, 'Mission 2'),
((SELECT ID FROM manga WHERE title = 'One Piece'), 1.0, 'Romance Dawn - The Dawn of a Great Adventure'),
((SELECT ID FROM manga WHERE title = 'One Piece'), 2.0, 'They Call Him "Straw Hat Luffy"');


-- Insert data into the 'image' table
-- Attack on Titan Chapter 1
INSERT INTO image (chapter_ID, page_number, link) VALUES
((SELECT ID FROM chapter WHERE manga_ID = (SELECT ID FROM manga WHERE title = 'Attack on Titan') AND number = 1.0), 1, 'https://example.com/aot/ch1/p1.jpg'),
((SELECT ID FROM chapter WHERE manga_ID = (SELECT ID FROM manga WHERE title = 'Attack on Titan') AND number = 1.0), 2, 'https://example.com/aot/ch1/p2.jpg');

-- Jujutsu Kaisen Chapter 1
INSERT INTO image (chapter_ID, page_number, link) VALUES
((SELECT ID FROM chapter WHERE manga_ID = (SELECT ID FROM manga WHERE title = 'Jujutsu Kaisen') AND number = 1.0), 1, 'https://example.com/jjk/ch1/p1.jpg'),
((SELECT ID FROM chapter WHERE manga_ID = (SELECT ID FROM manga WHERE title = 'Jujutsu Kaisen') AND number = 1.0), 2, 'https://example.com/jjk/ch1/p2.jpg');

-- Chainsaw Man Chapter 1
INSERT INTO image (chapter_ID, page_number, link) VALUES
((SELECT ID FROM chapter WHERE manga_ID = (SELECT ID FROM manga WHERE title = 'Chainsaw Man') AND number = 1.0), 1, 'https://example.com/csm/ch1/p1.jpg'),
((SELECT ID FROM chapter WHERE manga_ID = (SELECT ID FROM manga WHERE title = 'Chainsaw Man') AND number = 1.0), 2, 'https://example.com/csm/ch1/p2.jpg');


-- Insert data into the 'bookmark' table
INSERT INTO bookmark (user_ID, manga_ID, last_read_chapter_id) VALUES
(5, (SELECT ID FROM manga WHERE title = 'Attack on Titan'), (SELECT ID FROM chapter WHERE manga_ID = (SELECT ID FROM manga WHERE title = 'Attack on Titan') AND number = 2.0)),
(5, (SELECT ID FROM manga WHERE title = 'Jujutsu Kaisen'), (SELECT ID FROM chapter WHERE manga_ID = (SELECT ID FROM manga WHERE title = 'Jujutsu Kaisen') AND number = 1.0)),
(5, (SELECT ID FROM manga WHERE title = 'One Piece'), (SELECT ID FROM chapter WHERE manga_ID = (SELECT ID FROM manga WHERE title = 'One Piece') AND number = 1.0));


-- Insert data into the 'manga_comments' table
INSERT INTO manga_comments (manga_ID, user_ID, comment) VALUES
((SELECT ID FROM manga WHERE title = 'Attack on Titan'), 5, 'Absolutely epic story! Can''t wait for more.'),
((SELECT ID FROM manga WHERE title = 'Jujutsu Kaisen'), 5, 'The fights are so well choreographed.'),
((SELECT ID FROM manga WHERE title = 'Chainsaw Man'), 5, 'So unique and twisted, I love it!');

-- Insert data into the 'chapter_comments' table
INSERT INTO chapter_comments (chapter_ID, user_ID, comment) VALUES
((SELECT ID FROM chapter WHERE manga_ID = (SELECT ID FROM manga WHERE title = 'Attack on Titan') AND number = 1.0), 5, 'What a powerful opening chapter!'),
((SELECT ID FROM chapter WHERE manga_ID = (SELECT ID FROM manga WHERE title = 'Jujutsu Kaisen') AND number = 1.0), 5, 'Sukuna is terrifying.'),
((SELECT ID FROM chapter WHERE manga_ID = (SELECT ID FROM manga WHERE title = 'Chainsaw Man') AND number = 1.0), 5, 'Pochita is the best boy!');