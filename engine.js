// GENERATED from index.html by tools/make_engine.py: do not edit by hand.
// ================= Categories =================
const WOMEN_TITLES = /^(queen|princess|lady|dame|dr|saint|st|empress|madame|mrs|ms|miss) /;
const MEN_TITLES = /^(king|prince|lord|sir|dr|saint|st|emperor|pope|president|general|mr) /;
const ANY_TITLES = /^(the|queen|princess|lady|king|prince|lord|sir|dr|saint|st|emperor|empress|captain|mr|mrs|ms|miss|god|goddess) /;
const NAME_RULE = (real) => real
  ? `Name rule: if the person has a widely known last name, the player must give both first and last name. A first name alone (e.g. 'Oprah', 'Elvis', 'Hillary') or a last name alone (e.g. 'Curie', 'Obama', 'Messi') does not count: set valid to false and note 'Needs first and last name'. People widely known by a single name with no well-known surname (e.g. Cher, Madonna, Zendaya, Pelé, Bono, Cleopatra, Michelangelo) are fine with one name, and so are nicknames that are not part of their name.`
  : `Name rule: if the character has a widely known last name, the player must give both first and last name. A first name alone (e.g. 'Hermione', 'Homer', 'Harry') or a last name alone (e.g. 'Granger', 'Simpson', 'Potter') does not count: set valid to false and note 'Needs first and last name'. Characters widely known by a single name or title with no well-known surname (e.g. Elsa, Zeus, Athena, Batman, Gandalf, Moana) are fine with one name.`;
const PEOPLE_RULE_HELP = (pron, ex) => `If ${pron === 'her' ? 'she has' : pron === 'his' ? 'he has' : 'they have'} a well-known last name, type both: ${ex}. One-name stars are fine on their own. A last name on its own doesn't count.`;
const CATS = {
  // ---------- People ----------
  'real-women': { group: 'People', label: 'Women', plural: 'women', prompt: "Type a woman's name", file: 'data/real-women.txt', people: true, real: true, pron: 'her', titles: WOMEN_TITLES,
    blurb: 'Famous and historical women', rule: 'Real, notable women · any era, any field', tagline: 'Real · notable · no repeats',
    who: `one specific real woman who is notable (for example, she has or would plausibly have her own Wikipedia article). Any era, country, or field counts. Trans women count. Fictional characters, mythological figures, goddesses, men, bands, and made-up people do not.`,
    help: [`She has to be a real woman who's well known: famous, historical, or notable in her field. Trans women count. Fictional characters and goddesses don't (they have their own category).`, PEOPLE_RULE_HELP('her', 'Oprah Winfrey, not Oprah')] },
  'real-men': { group: 'People', label: 'Men', plural: 'men', prompt: "Type a man's name", file: 'data/real-men.txt', people: true, real: true, pron: 'his', titles: MEN_TITLES,
    blurb: 'Famous and historical men', rule: 'Real, notable men · any era, any field', tagline: 'Real · notable · no repeats',
    who: `one specific real man who is notable (for example, he has or would plausibly have his own Wikipedia article). Any era, country, or field counts. Trans men count. Fictional characters, legendary or mythological figures, gods, women, bands, and made-up people do not.`,
    help: [`He has to be a real man who's well known: famous, historical, or notable in his field. Trans men count. Fictional characters, legends and gods don't (they have their own category).`, PEOPLE_RULE_HELP('his', 'Elvis Presley, not Elvis')] },
  'people-of-color': { group: 'People', label: 'People of Color', plural: 'people of color', prompt: "Type a person's name", file: 'data/people-of-color.txt', people: true, real: true, pron: 'their', titles: ANY_TITLES,
    blurb: 'Notable people of color, worldwide', rule: 'Real, notable people of color from anywhere in the world · any era, any field', tagline: 'Real · notable · no repeats',
    who: `one specific real, notable person of color from any country or era: Black, Indigenous, Asian, Latino/Hispanic, Middle Eastern or North African, Pacific Islander, or multiracial. Fictional characters do not count.`,
    help: [`Any real, notable person of color counts, from anywhere in the world and any era: Black, Indigenous, Asian, Latino/Hispanic, Middle Eastern and North African, Pacific Islander and multiracial people.`, PEOPLE_RULE_HELP('their', 'Barack Obama, not Obama')] },
  'lgbtq': { group: 'People', label: 'LGBTQ+ People', plural: 'LGBTQ+ people', prompt: "Type a person's name", file: 'data/lgbtq.txt', people: true, real: true, pron: 'their', titles: ANY_TITLES,
    blurb: 'Publicly out LGBTQ+ people', rule: 'Real, notable people who are publicly out as LGBTQ+ · any era, any field', tagline: 'Real · out · no repeats',
    who: `one specific real, notable person who is publicly known to be lesbian, gay, bisexual, transgender, queer, nonbinary, asexual or otherwise LGBTQ+, based on their own public statements or well-documented history. Do not accept people based on rumor or speculation about their sexuality or gender. Fictional characters do not count.`,
    help: [`Any real, notable person who is publicly out as LGBTQ+ counts: lesbian, gay, bisexual, trans, queer, nonbinary and more, from any era or field.`, `It has to be public and documented, not rumor.`, PEOPLE_RULE_HELP('their', 'Elton John, not Elton')] },
  'actors': { group: 'Entertainment', label: 'Actors', plural: 'actors', prompt: "Type an actor's name", file: 'data/actors.txt', people: true, real: true, pron: 'their', titles: ANY_TITLES,
    blurb: 'Film, TV and stage actors and actresses', rule: 'Any real actor or actress · film, TV, stage or voice', tagline: 'Film · TV · stage',
    who: `one specific real actor or actress (film, television, stage or voice acting), from any era or country.`,
    help: [`Any real actor or actress counts: film, TV, stage or voice. Men and women both count.`, PEOPLE_RULE_HELP('their', 'Tom Hanks, not Tom')] },
  'singers': { group: 'Entertainment', label: 'Singers', plural: 'singers', prompt: "Type a singer's name", file: 'data/singers.txt', people: true, real: true, pron: 'their', titles: ANY_TITLES,
    blurb: 'Singers, rappers and Broadway stars', rule: 'Any real singer · pop, rap, country, opera, Broadway and more', tagline: 'Every genre · any era',
    who: `one specific real person known as a singer or vocalist in any genre, including rappers, opera singers and musical theatre performers who sing. Bands and groups do not count, but their individual singers do.`,
    help: [`Any real singer counts, in any genre: pop, rap, R&B, country, rock, opera, Broadway and musical theater.`, `Bands don't count, but their singers do (Freddie Mercury, not Queen).`, PEOPLE_RULE_HELP('their', 'Taylor Swift, not Taylor')] },
  'oscar-winners': { group: 'Entertainment', label: 'Oscar Winners', plural: 'Oscar winners', prompt: "Type an Oscar winner's name", file: 'data/oscar-winners.txt', people: true, real: true, pron: 'their', titles: ANY_TITLES,
    blurb: 'Anyone who has won an Academy Award', rule: 'Anyone who has won an Oscar, in any category', tagline: 'Any Oscar category',
    who: `one specific real person who has personally won at least one Academy Award (Oscar) in any category, including acting, directing, writing, music, technical, and honorary awards. Nominees who never won do not count.`,
    help: [`Anyone who has won an Academy Award counts, in any category: acting, directing, writing, music, technical or honorary. Nominees who never won don't count.`, PEOPLE_RULE_HELP('their', 'Meryl Streep, not Meryl')] },
  'us-presidents': { group: 'United States', label: 'US Presidents', plural: 'US presidents', prompt: "Type a president's name", file: 'data/us-presidents.txt', finite: true, pron: 'their', titles: MEN_TITLES,
    blurb: 'All 45 people who have been president', rule: '45 people have been president · Cleveland and Trump served twice but count once', tagline: 'Name them all',
    ambiguous: { bush: 'George H. W. Bush or George W. Bush', roosevelt: 'Theodore Roosevelt or Franklin D. Roosevelt', adams: 'John Adams or John Quincy Adams', harrison: 'William Henry Harrison or Benjamin Harrison', johnson: 'Andrew Johnson or Lyndon B. Johnson', 'george bush': 'George H. W. Bush or George W. Bush' },
    help: [`Name every person who has been President of the United States. Last names work when only one president had it (Lincoln, Obama). For Adams, Harrison, Johnson, Roosevelt and Bush, type the full name.`] },
  // ---------- Fiction ----------
  'fictional-women': { group: 'Fiction', label: 'Fictional Women', plural: 'fictional women', prompt: "Type a character's name", file: 'data/fictional-women.txt', people: true, real: false, pron: 'her', titles: ANY_TITLES,
    blurb: 'Books, film, TV, games, myth, folklore, religion', rule: 'Female characters, goddesses and figures from myth, folklore and religion', tagline: 'Fiction · myth · legend',
    who: `one specific female character who is not a real historical person: a character from books, film, TV, theatre, video games, comics or cartoons, or a goddess, mythological, folklore, legendary or religious/scriptural figure. Female animal characters count. Real people (including real people as portrayed in films) do not count, and neither do male characters, groups, or made-up characters that don't exist in any work.`,
    help: [`She has to be a female character from books, movies, TV, games, comics or cartoons, or a goddess or figure from myth, folklore, legend or religion. Female animal characters count too.`, `Real people don't count, even if they've been played in a movie.`, `If she has a well-known last name, type both: Hermione Granger, not Hermione. Characters known by one name (like Elsa, Athena or Moana) are fine on their own.`, `Alter egos count once: Catwoman or Selina Kyle, not both.`] },
  'fictional-men': { group: 'Fiction', label: 'Fictional Men', plural: 'fictional men', prompt: "Type a character's name", file: 'data/fictional-men.txt', people: true, real: false, pron: 'his', titles: ANY_TITLES,
    blurb: 'Books, film, TV, games, myth, folklore, religion', rule: 'Male characters, gods and figures from myth, folklore and religion', tagline: 'Fiction · myth · legend',
    who: `one specific male character who is not a real historical person: a character from books, film, TV, theatre, video games, comics or cartoons, or a god, mythological, folklore, legendary or religious/scriptural figure. Male animal characters count. Real people (including real people as portrayed in films) do not count, and neither do female characters, groups, or made-up characters that don't exist in any work.`,
    help: [`He has to be a male character from books, movies, TV, games, comics or cartoons, or a god or figure from myth, folklore, legend or religion. Male animal characters count too.`, `Real people don't count, even if they've been played in a movie.`, `If he has a well-known last name, type both: Homer Simpson, not Homer. Characters known by one name (like Zeus, Batman or Gandalf) are fine on their own.`, `Alter egos count once: Batman or Bruce Wayne, not both (same for Darth Vader and Anakin Skywalker).`] },
  'pokemon': { group: 'Fiction', label: 'Pokémon', plural: 'Pokémon', prompt: 'Type a Pokémon', file: 'data/pokemon.txt', titles: ANY_TITLES,
    blurb: 'Any Pokémon from any generation', rule: 'Any Pokémon species, any generation · forms and variants count once', tagline: 'Gotta name 100',
    who: `one specific Pokémon species from any generation of the Pokémon games. Alternate forms, regional variants, Megas and shinies are the same Pokémon and do not count separately.`,
    help: [`Any Pokémon species from any generation counts. Forms and regional variants (like Alolan Vulpix) count as the same Pokémon.`] },
  'disney': { group: 'Fiction', label: 'Disney Characters', plural: 'Disney characters', prompt: 'Type a Disney character', file: 'data/disney.txt', people: true, real: false, pron: 'their', titles: ANY_TITLES,
    blurb: 'Disney and Pixar films, shows and shorts', rule: 'Characters from Disney and Pixar films, shows and shorts · Marvel and Star Wars don\'t count', tagline: 'Disney · Pixar',
    who: `one specific character who comes from a Disney or Pixar production: Disney and Pixar animated or live-action films, shorts, Disney Channel and Disney TV animation shows, and Disney's own versions of fairy-tale and classic characters (Cinderella, Pinocchio, Mowgli). Characters from Marvel, Star Wars, Lucasfilm, The Muppets, 20th Century Fox/The Simpsons and other companies Disney bought do not count, and neither do real people.`,
    help: [`Any character from a Disney or Pixar film, short or show counts, including Disney Channel shows and Disney's versions of fairy tales (Cinderella, Mowgli).`, `Marvel and Star Wars characters don't count here, even though Disney owns them. Neither do the Muppets or The Simpsons. Disney villains count.`, `If they have a well-known last name, type both: Buzz Lightyear, not Buzz. One-name characters like Elsa or Stitch are fine.`] },
  'superheroes': { group: 'Fiction', label: 'Heroes & Villains', plural: 'heroes and villains', prompt: 'Type a hero or villain', file: 'data/superheroes.txt', people: true, real: false, pron: 'their', titles: ANY_TITLES,
    blurb: 'Superheroes, Disney villains, Star Wars', rule: 'Superheroes and supervillains (Marvel, DC and beyond), Disney villains, and Star Wars heroes and villains', tagline: 'Heroes · villains',
    who: `one specific character who is either (a) a superhero or supervillain from comics, film, TV, cartoons or anime (Marvel, DC, Image, The Incredibles, The Boys, My Hero Academia, TMNT, Powerpuff Girls and so on, including their sidekicks and arch-enemies), (b) a villain from a Disney or Pixar film or show, or (c) a hero or villain from Star Wars (any film, show, book or game). Other characters, ordinary villains from non-Disney films, and real people do not count. A hero and their secret identity are the same character.`,
    help: [`Three kinds of character count: superheroes and supervillains (Marvel, DC and beyond), Disney and Pixar villains (Maleficent, Scar, Ursula), and Star Wars heroes and villains (Luke Skywalker, Darth Vader).`, `Secret identities count once: Spider-Man or Peter Parker, Darth Vader or Anakin Skywalker, not both.`, `If they have a well-known last name, type both: Harley Quinn, not Harley.`] },
  'video-game-characters': { group: 'Fiction', label: 'Video Game Characters', plural: 'video game characters', prompt: 'Type a video game character', file: 'data/video-game-characters.txt', people: true, real: false, pron: 'their', titles: ANY_TITLES,
    blurb: 'Characters who come from games', rule: 'Characters who first appeared in a video game · movie and comic characters don\'t count, even if they\'re in games', tagline: 'Press start',
    who: `one specific character who originally comes from a video game (first appeared in a video game), from any era or platform: Mario, Lara Croft, Master Chief, Kratos, Pikachu and so on. Characters from films, comics or books who later appeared in games (Batman, Darth Vader) do not count, and neither do real people.`,
    help: [`Any character who first appeared in a video game counts: Mario, Link, Lara Croft, Master Chief, Pac-Man.`, `Movie, TV and comic characters who later showed up in games (like Batman or Darth Vader) don't count.`, `If they have a well-known last name, type both: Lara Croft, not Lara. One-name characters like Kirby or Kratos are fine.`] },
  // ---------- Places ----------
  'cities': { group: 'World', label: 'Cities', plural: 'cities', prompt: 'Type a city', file: 'data/cities.txt', titles: ANY_TITLES,
    blurb: 'Any city or town, past or present', rule: 'Any city or town in the world, past or present · historical cities like Constantinople count · same name counts once', tagline: 'Anywhere · any era',
    who: `one specific city or town anywhere in the world, current or historical (ancient and former cities such as Constantinople, Babylon or Tenochtitlan count). Countries, states, provinces, counties, neighborhoods, landmarks and fictional places do not count. Different cities with the same name (Paris, France and Paris, Texas) count as one answer.`,
    help: [`Any city or town in the world counts, big or small, past or present. Historical cities like Constantinople or Babylon count too.`, `Cities with the same name count once: Paris is Paris, whether it's in France or Texas.`, `Countries, states and neighborhoods don't count.`] },
  'us-states': { group: 'United States', label: 'US States', plural: 'US states', prompt: 'Type a state', file: 'data/us-states.txt', finite: true, titles: ANY_TITLES,
    blurb: 'All 50', rule: 'All 50 US states · DC and territories don\'t count', tagline: 'Name them all', help: [`Name all 50 US states. Washington, D.C. and territories like Puerto Rico don't count.`] },
  'state-capitals': { group: 'United States', label: 'State Capitals', plural: 'state capitals', prompt: 'Type a state capital', file: 'data/state-capitals.txt', finite: true, titles: ANY_TITLES,
    blurb: 'The capital of all 50 states', rule: 'The capital city of each of the 50 US states', tagline: 'Name them all',
    help: [`Name the capital city of each of the 50 US states. Answers are cities, like Sacramento or Austin.`] },
  'countries': { group: 'World', label: 'Countries', plural: 'countries', prompt: 'Type a country', file: 'data/countries.txt', finite: true, titles: ANY_TITLES,
    blurb: '197 countries', rule: '193 UN members + Vatican City, Palestine, Taiwan & Kosovo = 197 · former countries (like the USSR) don\'t count', tagline: 'Name them all',
    help: [`197 countries count: the 193 United Nations members, plus Vatican City and Palestine (UN observer states), plus Taiwan and Kosovo.`, `Countries that no longer exist (like the USSR, Yugoslavia or Czechoslovakia) and territories (like Greenland or Puerto Rico) don't count.`, `Common names work: Czechia or Czech Republic, Ivory Coast or Côte d'Ivoire, Burma or Myanmar.`] },
  'capitals': { group: 'World', label: 'World Capitals', plural: 'capitals', prompt: 'Type a capital city', file: 'data/capitals.txt', finite: true, titles: ANY_TITLES,
    blurb: 'The capital of all 197 countries', rule: 'One capital for each of the 197 countries · countries with two capitals accept either', tagline: 'Name them all',
    help: [`Name the capital city of each of the 197 countries (the same list as the Countries category).`, `Where a country has more than one capital (like South Africa or Bolivia), any of them counts, once.`] },
  // ---------- Entertainment ----------
  'movies': { group: 'Entertainment', label: 'Movies', plural: 'movies', prompt: 'Type a movie title', file: 'data/movies.txt', titles: ANY_TITLES,
    blurb: 'Any film, any era', rule: 'Any feature film · remakes with the same title count once', tagline: 'Any film · any era',
    who: `one specific feature film (any era or country, including animated and documentary films). TV series, short films and video games do not count.`,
    help: [`Any feature film counts, from any era or country, including animated films and documentaries. A remake with the same title as an earlier film counts once.`, `You can leave off "The" at the start of a title.`] },
  'tv-shows': { group: 'Entertainment', label: 'TV Shows', plural: 'TV shows', prompt: 'Type a TV show', file: 'data/tv-shows.txt', titles: ANY_TITLES,
    blurb: 'Any series, any era', rule: 'Any TV series · animated, reality and miniseries count', tagline: 'Any series · any era',
    who: `one specific television series (any country or era, including animated, reality, game show, talk show, streaming and miniseries). Films and individual episodes do not count.`,
    help: [`Any TV series counts: scripted, animated, reality, game shows, talk shows, streaming shows and miniseries.`, `You can leave off "The" at the start of a title.`] },
  'books': { group: 'Entertainment', label: 'Books', plural: 'books', prompt: 'Type a book title', file: 'data/books.txt', titles: ANY_TITLES,
    blurb: 'Novels, nonfiction, poetry, plays', rule: 'Any book title · series names don\'t count, the books in them do', tagline: 'Any book · any era',
    who: `one specific book or written work: a novel, nonfiction book, poetry collection, play, epic poem, religious text, or children's book. A series name on its own (like 'Harry Potter') does not count, but individual books in a series do.`,
    help: [`Any book counts: novels, nonfiction, poetry, plays, children's books and classics. A series name alone (like Harry Potter) doesn't count, but each book in it does.`, `You can leave off "The" at the start of a title.`] },
  'best-picture': { group: 'Entertainment', label: 'Best Picture Winners', plural: 'Best Picture winners', prompt: 'Type a Best Picture winner', file: 'data/best-picture.txt', finite: true, titles: ANY_TITLES,
    blurb: 'All 98 Oscar Best Picture winners', rule: 'All 98 Best Picture winners, from Wings (1929) to One Battle After Another (2026)', tagline: 'Name them all',
    help: [`Name every film that won the Academy Award for Best Picture, all 98 from the first Oscars in 1929 to 2026.`, `You can leave off "The" at the start of a title.`] },
  'tony-best-musical': { group: 'Entertainment', label: 'Tony Best Musicals', plural: 'Best Musical winners', prompt: 'Type a Tony-winning musical', file: 'data/tony-best-musical.txt', finite: true, titles: ANY_TITLES,
    blurb: 'All 78 Tony Award Best Musical winners', rule: 'All 78 Tony Best Musical winners, from Kiss Me, Kate (1949) to Schmigadoon! (2026) · 1960 was a tie', tagline: 'Name them all',
    help: [`Name every show that won the Tony Award for Best Musical, from Kiss Me, Kate in 1949 to Schmigadoon! in 2026. 1960 was a tie (Fiorello! and The Sound of Music), so both count.`, `You can leave off "The" at the start of a title.`] },
  // ---------- Sports ----------
  'athletes': { group: 'Sports', label: 'Athletes', plural: 'athletes', prompt: "Type an athlete's name", file: 'data/athletes.txt', people: true, real: true, pron: 'their', titles: ANY_TITLES,
    ambiguous: { ronaldo: 'Cristiano Ronaldo or Ronaldo Nazário? Type the full name' },
    blurb: 'Any sport, men and women, any era', rule: 'Real athletes from any sport · coaches and owners who never competed don\'t count', tagline: 'Any sport · any era',
    who: `one specific real person who has competed as an athlete in any sport (professional, Olympic, college or international level), from any era or country. Racing drivers, jockeys, pro wrestlers, bodybuilders and esports or chess players who compete count. Coaches, owners, commentators and referees only count if they also competed themselves. Fictional athletes do not count.`,
    help: [`Any real athlete counts, from any sport and any era: men and women, Olympians, pros, racing drivers, jockeys, pro wrestlers.`, `Coaches, owners and commentators only count if they competed themselves.`, PEOPLE_RULE_HELP('their', 'LeBron James, not LeBron')] },
  'sports': { group: 'Sports', label: 'Sports', plural: 'sports', prompt: 'Type a sport', file: 'data/sports.txt', titles: ANY_TITLES,
    blurb: 'Any sport or competitive game', rule: 'Any sport · events inside one sport (long jump, the 100m) count as that sport', tagline: 'Any sport · any era',
    ambiguous: { football: 'American football, soccer, Australian rules, Gaelic football or Canadian football? Type which one', rugby: 'Rugby union, rugby league or rugby sevens? Type which one', hockey: 'Ice hockey or field hockey? Type which one', skating: 'Figure skating, speed skating, roller skating or skateboarding? Type which one' },
    who: `one specific sport: a physical sport, or a competitive game of skill played as a sport (such as chess, darts, poker or esports). Distinct versions with their own name and competitions count separately (beach volleyball, rugby league, BMX, ski jumping). Single events inside one sport do not: long jump or the 100m is athletics, a slalom is alpine skiing, a league or tournament (NFL, Wimbledon) is not a sport, so set "name" to the sport itself. Casual hobbies and exercise routines (yoga, hiking, walking) and ordinary card, board or video games do not count.`,
    help: [`Any sport counts, from pickleball to sumo. Versions with their own name and competitions count separately: beach volleyball, rugby league, BMX.`, `Events inside one sport count as that sport: the long jump is athletics, slalom is alpine skiing.`, `Leagues and tournaments (NFL, Wimbledon, Formula One) count as their sport. Hobbies like yoga or hiking don't count.`, `"Football", "rugby" and "hockey" need the kind: American football or soccer, rugby union or league, ice or field hockey.`] },
  'sports-teams': { group: 'Sports', label: 'Sports Teams', plural: 'sports teams', prompt: 'Type a team', file: 'data/sports-teams.txt', finite: true, titles: ANY_TITLES,
    blurb: 'All 124 NFL, NBA, MLB & NHL teams', rule: 'All 124 NFL, NBA, MLB & NHL teams · shared nicknames need the city', tagline: 'Name them all',
    ambiguous: { giants: 'New York Giants (NFL) or San Francisco Giants (MLB)', jets: 'New York Jets (NFL) or Winnipeg Jets (NHL)', rangers: 'New York Rangers (NHL) or Texas Rangers (MLB)', cardinals: 'Arizona Cardinals (NFL) or St. Louis Cardinals (MLB)', panthers: 'Carolina Panthers (NFL) or Florida Panthers (NHL)', kings: 'Sacramento Kings (NBA) or Los Angeles Kings (NHL)' },
    help: [`Name all 124 teams in the NFL, NBA, MLB and NHL.`, `A nickname alone works (Yankees, Lakers), except when two teams share it: Giants, Jets, Rangers, Cardinals, Panthers and Kings need the city too.`] },
  // ---------- Things ----------
  'brands': { group: 'Things', label: 'Brands', plural: 'brands', prompt: 'Type a brand', file: 'data/brands.txt', titles: ANY_TITLES,
    blurb: 'Brands and companies', rule: 'Any brand or company', tagline: 'Any brand · any company',
    who: `one specific brand or company that sells products or services (consumer brands, companies, restaurant chains, car makes, tech companies, fashion labels, etc.). Generic product types do not count.`,
    help: [`Any brand or company counts: food and drink, cars, tech, fashion, restaurants, stores and more.`] },
  'animals': { group: 'Things', label: 'Animals', plural: 'animals', prompt: 'Type an animal', file: 'data/animals.txt', titles: ANY_TITLES,
    blurb: 'Any kind of animal', rule: 'Any real kind of animal · breeds count as their animal (a poodle is a dog)', tagline: 'Any animal',
    who: `one real kind of animal (a species or a commonly named kind, such as 'lion', 'shark' or 'eagle'), including extinct animals like dinosaurs. Mythical creatures do not count. Breeds of domestic animals are not separate animals: a poodle is a dog, so set "name" to the animal (e.g. 'Dog').`,
    help: [`Any real kind of animal counts, including extinct ones. Mythical creatures don't.`, `Breeds count as their animal: a poodle is a dog, so you can't count both.`] }
};
// Sub-options inside a category (e.g. Books → genre). Each option is its own category id ("books-fantasy")
// with sub: parent and a filter code; the parent's file is filtered to lines whose third tab field has the code.
// The game screen shows a picker next to the category button when the category has sub-options.
function addSubs(parent, kind, allLabel, list, extra) {
  CATS[parent].subKind = kind; CATS[parent].subAll = allLabel;
  for (const [code, name, adj, own] of list) {
    const id = parent + '-' + name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/-$/, '');   // books-mystery-thriller, books-historical
    CATS[id] = { ...CATS[parent], sub: parent, filter: code, subName: name, subKind: kind, subAll: allLabel,
      label: `${name} ${CATS[parent].label}`, plural: `${adj} ${CATS[parent].plural}`,
      blurb: name, rule: `${adj[0].toUpperCase() + adj.slice(1)} ${CATS[parent].plural}`, tagline: `${name} · any era`,
      ...(extra ? extra(name, adj) : {}), ...(own || {}) };
  }
}
// Book genres: readers' tags from Hardcover (hardcover.app). A book can be in more than one genre.
addSubs('books', 'Genre', 'All genres', [
  ['fa', 'Fantasy', 'fantasy'], ['sf', 'Sci-Fi', 'sci-fi'], ['ho', 'Horror', 'horror'], ['ro', 'Romance', 'romance'],
  ['my', 'Mystery', 'mystery or thriller'], ['hf', 'Historical', 'historical fiction'], ['cl', 'Classics', 'classic'],
  ['ya', 'Young Adult', 'young adult'], ['nf', 'Nonfiction', 'nonfiction']
]);
for (const id in CATS) if (CATS[id].sub === 'books') {
  const c = CATS[id];
  c.rule += ' · genres from Hardcover readers';
  c.who = `one specific ${c.plural.replace(/ books$/, '')} book. A series name on its own does not count, but individual books in a series do.`;
  c.help = [`Any ${c.plural.replace(/ books$/, '')} book counts. Genres come from readers' tags on Hardcover (hardcover.app), so a book can count in more than one genre.`, `A series name alone (like Harry Potter) doesn't count, but each book in it does.`, `You can leave off "The" at the start of a title.`];
}
// Wikidata-based sub-options (data is CC0). Codes are the third tab field in each list file.
const WD_NOTE = '';
const subHelp = (what) => [`${what} An answer can count in more than one.`];
for (const [parent, who] of [['real-women', 'Women'], ['real-men', 'Men']]) {
  const w = who.toLowerCase(), sex = who === 'Women' ? 'Female' : 'Male';
  addSubs(parent, 'Subcategory', `All ${w}`, [
    ['at', 'Athletes', 'athletes'], ['mu', 'Musicians', 'musicians'], ['ac', 'Actors', who === 'Women' ? 'actresses' : 'actors'],
    ['hi', 'Historical', 'historical', { label: `Historical ${who}`, plural: `historical ${w}`, rule: `${who} born before 1900` + WD_NOTE }],
    ['sc', 'Scientists', 'scientists and inventors', { rule: `${who} known as scientists or inventors` + WD_NOTE }],
    ['wr', 'Writers', 'writers'], ['ar', 'Artists', 'artists', { rule: `${who} known as painters, sculptors, photographers and other visual artists` + WD_NOTE }],
    ['in', 'Internet Personalities', 'internet personalities', { subShort: 'Internet', label: `${sex} Internet Personalities`, rule: `YouTubers, streamers, TikTokers and influencers` + WD_NOTE }]
  ], (name, adj) => ({ label: `${sex} ${name}`, plural: `${sex.toLowerCase()} ${adj}`, rule: `${who} known as ${adj}` + WD_NOTE,
    help: [...subHelp(`Real, notable ${w} known as ${adj}.`), ...CATS[parent].help] }));
}
addSubs('movies', 'Genre', 'All genres', [
  ['ac', 'Action', 'action'], ['cm', 'Comedy', 'comedy'], ['dr', 'Drama', 'drama'], ['ho', 'Horror', 'horror'],
  ['sf', 'Sci-Fi', 'sci-fi'], ['fa', 'Fantasy', 'fantasy'], ['an', 'Animated', 'animated'], ['ro', 'Romance', 'romance'],
  ['th', 'Thriller', 'thriller, crime or mystery'], ['mu', 'Musical', 'musical']
], (name, adj) => ({ label: `${name} Movies`, rule: `${adj[0].toUpperCase() + adj.slice(1)} movies` + WD_NOTE, help: [...subHelp(`Any ${adj} movie counts.`), ...CATS.movies.help] }));
addSubs('tv-shows', 'Genre', 'All genres', [
  ['cm', 'Comedy', 'comedy'], ['dr', 'Drama', 'drama'],
  ['cr', 'Crime & Procedurals', 'crime, police, legal or medical', { subShort: 'Crime', label: 'Crime & Procedural TV Shows' }],
  ['sf', 'Sci-Fi', 'sci-fi'], ['an', 'Animated', 'animated'], ['ki', 'Kids', "kids'"],
  ['re', 'Reality & Game Shows', 'reality or game', { subShort: 'Reality', label: 'Reality & Game Shows' }]
], (name, adj) => ({ label: `${name} TV Shows`, rule: `${adj[0].toUpperCase() + adj.slice(1)} TV shows` + WD_NOTE, help: [...subHelp(`Any ${adj} TV show counts.`), ...CATS['tv-shows'].help] }));
addSubs('singers', 'Genre', 'All genres', [
  ['po', 'Pop', 'pop'], ['rk', 'Rock', 'rock'], ['bw', 'Broadway', 'Broadway and musical theater']
], (name, adj) => ({ label: `${name} Singers`, plural: `${adj} singers`, rule: `${adj[0].toUpperCase() + adj.slice(1)} singers` + WD_NOTE, help: [...subHelp(`Any singer known for ${adj} counts.`), ...CATS.singers.help] }));
// Goal option (50 or 100) for open lists. These harder ones start at 50; players can switch, and it's remembered per category.
for (const id of ['singers-broadway', 'movies-musical', 'tv-shows-reality-game-shows', 'tv-shows-kids', 'books-horror',
  'real-women-internet-personalities', 'real-men-internet-personalities',
  'real-women-scientists', 'real-men-scientists', 'real-women-artists', 'real-men-artists']) if (CATS[id]) CATS[id].goal = 50;
const ENT_ORDER = ['actors', 'singers', 'oscar-winners'];
const CAT_IDS = Object.keys(CATS).filter(id => !CATS[id].sub).sort((a, b) => (ENT_ORDER.indexOf(a) < 0 ? 0 : ENT_ORDER.indexOf(a) - 9) - (ENT_ORDER.indexOf(b) < 0 ? 0 : ENT_ORDER.indexOf(b) - 9) || 0);

// ================= Matching =================
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/&/g, ' and ')
  .replace(/[’'`.!]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const firstLast = n => { const t = n.split(' '); return t.length >= 3 ? t[0] + ' ' + t[t.length-1] : null; };
const DB = {};                       // per category: {INDEX, CANON_KEYS, RARE_KEYS, META, NAMES}
let INDEX = new Map(), CANON_KEYS = [], RARE_KEYS = [], META = new Map(), NAMES = new Map();

function parseData(text, articles) {
  const index = new Map(), keys = [], rare = [], meta = new Map(), names = new Map();
  let cat = '';
  for (const raw of text.split('\n')) {
    if (!raw) continue;
    if (raw.startsWith('#')) { cat = raw.slice(1).trim(); continue; }
    // "~Name" = less famous: typos are matched only after the famous names. A tab separates an optional label (category or "from" work).
    const exactOnly = raw.startsWith('~');
    const [namesPart, label] = (exactOnly ? raw.slice(1) : raw).split('\t');
    const parts = namesPart.split('|').map(s => s.trim()).filter(Boolean);
    if (!parts.length) continue;
    const canon = parts[0];
    if (!meta.has(canon)) meta.set(canon, (label || cat || '').trim());
    if (!names.has(canon)) names.set(canon, parts);
    for (const p of parts) {
      const k = norm(p); if (!k) continue;
      if (!index.has(k)) index.set(k, canon);
      (exactOnly ? rare : keys).push([k, canon]);
      if (articles) { const bare = k.replace(/^(the|a|an) /, ''); if (bare !== k && bare.length > 2 && !index.has(bare)) index.set(bare, canon); }
    }
  }
  for (const [k, canon] of keys) { const fl = firstLast(k); if (fl && !index.has(fl)) index.set(fl, canon); }
  return { INDEX: index, CANON_KEYS: keys, RARE_KEYS: rare, META: meta, NAMES: names };
}

function lev(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]; let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + (a[i-1] === b[j-1] ? 0 : 1));
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}
function exactMatch(input) {
  const k = norm(input); if (!k) return null;
  const stripped = k.replace(cfg().titles, '');
  for (const c of [k, stripped, firstLast(k), firstLast(stripped)]) if (c && INDEX.has(c)) return INDEX.get(c);
  return null;
}
// Typos allowed: none under 5 letters, 1 up to 8, 2 up to 14, 3 for longer names (spaces and hyphens count as letters).
const editsFor = n => n < 5 ? 0 : n < 9 ? 1 : n < 15 ? 2 : 3;
function closest(k, keys, max) {
  let best = null, bestD = max + 1;
  for (const [key, canon] of keys) {
    if (key.length < 5) continue;
    const cap = Math.min(max, editsFor(key.length));
    if (!cap) continue;
    const d = lev(k, key, cap);
    if (d <= cap && d < bestD) { bestD = d; best = canon; if (d === 1) max = 1; }
  }
  return best;
}
// localMatch against another loaded list (e.g. all Movies while playing Animated Movies)
function matchIn(db, raw) {
  const save = { INDEX, CANON_KEYS, RARE_KEYS, META, NAMES };
  ({ INDEX, CANON_KEYS, RARE_KEYS, META, NAMES } = db);
  try { return localMatch(raw); } finally { ({ INDEX, CANON_KEYS, RARE_KEYS, META, NAMES } = save); }
}
function localMatch(input) {
  const hit = exactMatch(input); if (hit) return hit;
  if (input.includes(',')) { const h2 = exactMatch(input.split(',')[0]); if (h2) return h2; }   // "Paris, Texas" -> Paris
  const k = norm(input), max = !k.includes(' ') && k.length < 6 ? 0 : editsFor(k.length);   // short single words (a bare surname) must be exact
  if (!max) return null;
  // famous names first, so a typo lands on the person most players mean; then everyone else on the list
  return closest(k, CANON_KEYS, max) || closest(k, RARE_KEYS, max);
}
const TITLES = new Set(['queen','princess','lady','dame','saint','st','empress','madame','mother','rani','king','prince','pope','emperor','mahatma','colonel','dr','sir','chairman','mr','mrs','ms','miss','prophet','lord','darth','captain','doctor','professor','mister','general','count','uncle','aunt','father','sister','brother','agent','detective','officer','commander','the']);
// One word that is just part of a longer name (a first name or a last name) doesn't count, in every category:
// "Hermione" needs "Hermione Granger", "Oprah" needs "Oprah Winfrey". One-name people and characters (Cher, Zeus, Elsa)
// and nicknames that aren't part of the name ("Shaq") are fine.
// Known by this one name, and their last name isn't widely known (or isn't really a surname)
const ONE_NAME_OK = new Set(['jesus','selena','jennie','solange','brandy','fantasia','tini','suzy','natalya','apollonia','melanie','spice','mariale','zubaidah','mkabayi','malala','marta','v','rm','shaka','attila','lula','galileo','dante','canelo','zlatan','giannis','luka','khabib','pharrell','tupac','logan','messi']);
function surnameOnly(raw, canon) {
  if (!cfg().people) return false;
  const w = norm(raw).split(' ');
  if (w.length !== 1 || ONE_NAME_OK.has(w[0])) return false;
  if (w[0] === norm(canon)) return false;                       // the main name itself (Batman, Zeus, Cher)
  const e1 = editsFor(w[0].length);
  if (e1 && lev(w[0], norm(canon).replace(/ /g, ''), e1) <= e1) return false;   // a misspelled one-name star (Beyonse)
  const core = norm(canon).split(' '); while (core.length > 1 && TITLES.has(core[0])) core.shift();
  if (core.length === 1 && w[0] === core[0]) return false;      // main name minus a title (Voldemort, Vader)
  const cn = norm(canon).split(' '); if (cn.length >= 3 && (cn[1] === 'the' || cn[1] === 'of') && cn[0] === w[0]) return false;   // Sonic (the Hedgehog), Geralt (of Rivia)
  // check every multi-word name this person or character goes by (Darth Vader / Anakin Skywalker)
  for (const name of (NAMES.get(canon) || [canon])) {
    const t = norm(name).split(' ');
    if (t.length < 2 || TITLES.has(t[0])) continue;
    if (t.length >= 3 && (t[1] === 'the' || t[1] === 'of') && t[0] === w[0]) continue;   // Sonic (the Hedgehog), Geralt (of Rivia)
    if (t.some(x => x.length > 1 && lev(w[0], x, x.length > 5 ? 1 : 0) <= (x.length > 5 ? 1 : 0))) return true;
  }
  return false;
}


// ================= Battle helpers (generated by make_engine.py) =================
let curCat = null;
const cfg = () => CATS[curCat];
const RAW = {};
// Sub-options (genres, subcategories) of a category, in menu order
const subsOf = parent => Object.keys(CATS).filter(id => CATS[id].sub === parent);
async function loadCat(id) {
  if (!DB[id]) {
    const c = CATS[id];
    if (!RAW[c.file]) { const r = await fetch(c.file); if (!r.ok) throw new Error('HTTP ' + r.status); RAW[c.file] = await r.text(); }
    let text = RAW[c.file];
    if (c.filter) {
      if (!DB[c.sub]) DB[c.sub] = parseData(text, !c.people);   // whole list, to say "counts in Men, but not in Athletes"
      text = text.split('\n').filter(l => l.startsWith('#') || (l.split('\t')[2] || '').split(',').includes(c.filter)).join('\n');
    }
    DB[id] = parseData(text, !c.people);
  }
  curCat = id;
  ({ INDEX, CANON_KEYS, RARE_KEYS, META, NAMES } = DB[id]);
  return CATS[id].finite ? META.size : null;
}
function checkAnswer(raw) {
  const c = cfg();
  if (c.ambiguous && c.ambiguous[norm(raw)]) return { err: `"${raw}" — be more specific` };
  const local = localMatch(raw);
  if (local && surnameOnly(raw, local)) return { err: `Type ${c.pron || 'the'} full name — "${raw}" alone doesn't count` };
  if (local) return { canon: local };
  if (c.filter && DB[c.sub]) {
    const hit = matchIn(DB[c.sub], raw);
    if (hit) return { err: c.sub === 'books' ? `${hit} is a book, but readers don't tag it ${c.subName}` : `${hit} counts in ${CATS[c.sub].label}, but not in ${c.subName}` };
  }
  return { err: c.finite ? `"${raw}" isn't one of the ${META.size} ${c.plural} — check spelling` : `"${raw}" isn't on the list — check spelling` };
}
