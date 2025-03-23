import { AgeRating, Genres, Platform, Prisma } from "@prisma/client";

export const GAMES: Prisma.GameCreateManyInput[] = [
    {
        title: "Yakuza: Like a Dragon",
        genres: [Genres.RPG, Genres.Action],
        platforms: [Platform.PC, Platform.PlayStation, Platform.Xbox],
        relaseDate: new Date('2020-11-10'),
        price: 59.99,
        rating: 8.9,
        ageRating: AgeRating.M,
        developer: 'Ryu Ga Gotoku Studio',
        publisher: 'Sega',
        image: '/uploads/game/yakuza.jpg'
    },
    {
        title: "Nioh 2",
        genres: [Genres.RPG, Genres.Action],
        platforms: [Platform.PC, Platform.PlayStation, Platform.Xbox],
        relaseDate: new Date('2020-03-13'),
        price: 49.99,
        rating: 9,
        ageRating: AgeRating.M,
        developer: 'Team Ninja',
        publisher: 'Koei Tecmo',
        image: '/uploads/game/nioh.jpg'
    },
    {
        title: "Witcher 3: Wild Hunt",
        genres: [Genres.RPG, Genres.Action],
        platforms: [Platform.PC, Platform.PlayStation, Platform.Xbox],
        relaseDate: new Date('2015-05-19'),
        price: 49.99,
        rating: 9.8,
        ageRating: AgeRating.AO,
        developer: 'CD Projekt RED',
        publisher: 'CD Projekt',
        image: '/uploads/game/witcher.jpg'
    }

]