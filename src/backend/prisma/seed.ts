import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    posts: {
      create: [
        {
          title: 'Join the Prisma Slack',
          content: 'https://slack.prisma.io',
          published: true,
          comments: {
            create: [
              {
                content: 'Vanity and pride are different things, though the words are often used synonymously. A person may be proud without being vain. Pride relates more to our opinion of ourselves, vanity to what we would have others think of us.',
              },
              {
                content: 'There is, I believe, in every disposition a tendency to some particular evil—a natural defect, which not even the best education can overcome.',
              }
            ]
          }
        },
      ],
    },
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
    posts: {
      create: [
        {
          title: 'Follow Prisma on Twitter',
          content: 'https://www.twitter.com/prisma',
          published: true,
          comments: {
            create: [
              {
                content: 'Nothing is more deceitful…than the appearance of humility. It is often only carelessness of opinion, and sometimes an indirect boast.',
              },
              {
                content: 'A person who can write a long letter with ease, cannot write ill.',
              },
              {
                content: 'Is not general incivility the very essence of love?',
              }
            ]
          }
        },
      ],
    },
  },
  {
    name: 'Mahmoud',
    email: 'mahmoud@prisma.io',
    posts: {
      create: [
        {
          title: 'Ask a question about Prisma on GitHub',
          content: 'https://www.github.com/prisma/prisma/discussions',
          published: true,
        },
        {
          title: 'Prisma on YouTube',
          content: 'https://pris.ly/youtube',
        },
      ],
    },
  },
]

const commentsUpdate: Prisma.CommentUpdateInput[] = [
  {
    author: { connect: {email: 'nilu@prisma.io'} }
  },
  {
    author: { connect: {email: 'alice@prisma.io'} }
  },
  {
    author: { connect: {email: 'mahmoud@prisma.io'} }
  },
  {
    author: { connect: {email: 'alice@prisma.io'} }
  },
  {
    author: { connect: {email: 'mahmoud@prisma.io'} }
  }
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  for (var i=0; i < commentsUpdate.length; i++){
    const comment = await prisma.comment.update({
      where: {id: i+1},
      data: commentsUpdate[i]
    })
    console.log(`Updated comment with id: ${comment.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
