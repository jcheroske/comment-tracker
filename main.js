import { LocalDate } from '@js-joda/core';
import { PrismaClient } from '@prisma/client';
import { pick } from 'lodash/fp';
import SwaggerClient from 'swagger-client';
import { loadAndValidateEnv } from './util/loadAndValidateEnv';
const DOCKET_ID = 'CDC-2020-0087';
const DOCUMENT_ID = 'CDC-2020-0087-0001';
const env = loadAndValidateEnv();
let prisma;
let swagger;
(async () => {
    swagger = await getSwaggerClient();
    prisma = new PrismaClient();
    const docket = createDocket(DOCKET_ID);
    try {
        let document = await prisma.document.findOne({ where: { id: DOCUMENT_ID } });
        if (!document) {
            const documentResult = await swagger.apis.documents.get_documents__documentId_({
                documentId: DOCUMENT_ID,
            });
            checkSwaggerResult(documentResult);
            document = await prisma.document.create({
                data: {
                    ...newModelFromResult(documentResult),
                    docket: connectToModel('docketId', documentResult),
                },
            });
            console.log('Created document');
        }
        else {
            console.log('Document already exists in database!');
        }
        const commentStartDate = convertDateTimeToLocalDate(document.attributes.commentStartDate);
        const commentEndDate = convertDateTimeToLocalDate(document.attributes.commentEndDate);
        const today = LocalDate.now();
        const loopEndDate = commentEndDate.isBefore(today) ? commentEndDate : today;
        for (let d = commentStartDate; d.compareTo(loopEndDate) <= 0; d = d.plusDays(1)) {
            let pageNumber, totalPages;
            do {
                const commentsResult = await swagger.apis.comments.get_comments({
                    'filter[commentOnId]': document.attributes.objectId,
                    'filter[postedDate]': d.toString(),
                    sort: 'postedDate',
                });
                checkSwaggerResult(commentsResult);
                const { data, meta } = commentsResult.obj;
                for (let i = 0; i < data.length; i++) {
                    const commentId = data[0].id;
                    const comment = await prisma.comment.findOne({
                        where: { id: commentId },
                    });
                    if (!comment) {
                        const commentResult = swagger.apis.comments.get_comments__commentId_({ commentId });
                        checkSwaggerResult(commentResult);
                    }
                }
                pageNumber = meta.pageNumber;
                totalPages = meta.totalPages;
                console.log(`date: ${d.toString()}, num: ${meta.totalElements}, totalPages: ${meta.totalPages}, pageNum: ${meta.pageNumber}, pageSize: ${meta.pageSize}`);
            } while (pageNumber < totalPages);
        }
    }
    catch (e) {
        console.log(e);
    }
    finally {
        await prisma.$disconnect();
    }
})();
async function createDocket(docketId) {
    let docket = await prisma.docket.findOne({ where: { id: DOCKET_ID } });
    if (!docket) {
        const docketResult = await swagger.apis.dockets.get_dockets__docketId_({
            docketId,
        });
        checkSwaggerResult(docketResult);
        docket = await prisma.docket.create({
            data: newModelFromResult(docketResult),
        });
    }
    return docket;
}
async function getSwaggerClient() {
    const requestInterceptor = (req) => {
        // @ts-ignore
        req.headers['x-api-key'] = env.REGULATIONS_API_KEY;
        return req;
    };
    return await new SwaggerClient({
        url: env.REGULATIONS_OPEN_API_SPEC_URL,
        requestInterceptor,
    });
}
function checkSwaggerResult(result) {
    if (!result.ok) {
        throw new Error(`Swagger error: ${result.status} - ${result.statusText}`);
    }
}
function newModelFromResult(result) {
    return pick(['id', 'attributes', 'links', 'relationships'], result.obj.data);
}
function connectToModel(foreignKey, result) {
    return {
        connect: {
            id: result.obj.data.attributes[foreignKey],
        },
    };
}
function convertDateTimeToLocalDate(datetime) {
    return LocalDate.parse(datetime.split('T')[0]);
}
//# sourceMappingURL=main.js.map