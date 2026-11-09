import { createClient } from '@libsql/client';

const TURSO_URL =
	(typeof process !== 'undefined' && process.env?.TURSO_DATABASE_URL) ||
	'https://mailing-list-viksa.aws-eu-central-1.turso.io';

const TURSO_AUTH_TOKEN =
	(typeof process !== 'undefined' && process.env?.TURSO_AUTH_TOKEN) ||
	'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMwOTk3ODgsImlkIjoiMDFhMTdkMTItOGUwMS03NGFhLTliZjgtY2NiOTFiMzE0M2M0Iiwia2lkIjoiOGhGR29DdEJHVElWU0RDZlVEbno5VGFxNmVCS1JCeXNackVIWXV0OW5OVSIsInJpZCI6IjVlNjBiYWNjLWE4NDUtNDdmZC05NDcyLTBmM2YzOWE4ZjBjMSJ9.daV4iE6FQxchXONd6AILQ_1feVeputZnhKg951IknUdaOcX0Ouw__IHmFliuBV21NJBXJRcFYGeRueWOv_jIDw';

export const turso = createClient({
	url: TURSO_URL.replace(/^libsql:\/\//, 'https://'),
	authToken: TURSO_AUTH_TOKEN
});
