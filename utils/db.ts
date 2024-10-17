import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};
//prismaClientSingleton 함수는 새로운 PrismaClient 인스턴스를 생성하여 반환합니다.


type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;
//PrismaClientSingleton 타입은 prismaClientSingleton 함수의 반환 타입을 정의합니다. 
//이는 타입 안전성을 높이는 데 도움이 됩니다.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

//globalForPrisma는 전역 객체인 globalThis를 타입 변환하여 PrismaClient 인스턴스를 보관할 수 있는 전역 변수를 설정합니다. 
//이는 전역 범위에서 데이터베이스 클라이언트를 재사용할 수 있도록 도와줍니다.

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

//globalForPrisma.prisma가 이미 정의되어 있으면 그 인스턴스를 사용하고, 그렇지 않으면 새로운 PrismaClient 인스턴스를 생성합니다. 
// 이는 동일한 인스턴스를 재사용함으로써 리소스 낭비를 줄이는 데 도움이 됩니다.

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;



