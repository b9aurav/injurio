import { GraphQLDateTime } from "graphql-scalars";

export const resolvers = {
  DateTime: GraphQLDateTime,

  Query: {
    injuryReports: async (_parent: any, _args: any, ctx: any) =>
      await ctx.prisma.injuryReport.findMany(),
    injuryDetail: async (_parent: any, { reportId }: any, ctx: any) =>
      await ctx.prisma.injuryDetail.findMany({ where: { reportId: reportId } }),
    allUsers: async (_parent: any, _args: any, ctx: any) =>
      await ctx.prisma.user.findMany(),
    user: async (_parent: any, { id }: any, ctx: any) =>
      await ctx.prisma.user.findUnique({ where: { id } }),
  },

  InjuryReport: {
    injuries: async (parent: any, _args: any, ctx: any) =>
      await ctx.prisma.injuryDetail.findMany({
        where: { reportId: parent.id },
      }),
    user: async (parent: any, _args: any, ctx: any) =>
      await ctx.prisma.user.findUnique({
        where: { id: parent.userId },
      }),
  },

  InjuryDetail: {
    report: async (parent: any, _args: any, ctx: any) =>
      await ctx.prisma.injuryReport.findUnique({
        where: { id: parent.reportId },
      }),
  },

  User: {
    reports: async (parent: any, _args: any, ctx: any) =>
      await ctx.prisma.injuryReport.findMany({
        where: { userId: parent.id },
      }),
  },

  Mutation: {
    createInjuryReport: async (_parent: any, { data }: any, ctx: any) =>
      await ctx.prisma.injuryReport.create({ data }),
    updateInjuryReport: async (_parent: any, { id, data }: any, ctx: any) =>
      await ctx.prisma.injuryReport.update({ where: { id }, data }),
    deleteInjuryReport: async (_parent: any, { id }: any, ctx: any) => {
      try {
        await ctx.prisma.injuryReport.delete({ where: { id } });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    createInjuryDetail: async (_parent: any, { data }: any, ctx: any) =>
      await ctx.prisma.injuryDetail.create({ data }),
    deleteInjuryDetail: async (_parent: any, { reportId }: any, ctx: any) => {
      try {
        await ctx.prisma.injuryDetail.deleteMany({ where: { reportId } });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },

    createUser: async (_parent: any, { data }: any, ctx: any) =>
      await ctx.prisma.user.create({ data }),
  },
};
