import "dotenv/config";
import * as prismic from "@prismicio/client";
import { repositoryName } from "@/slicemachine.config.json";
import { AllDocumentTypes } from "@/prismicio-types";

// update page by page
const pagesToUpdate = [
    {
        type: "home_page",
    },
    {
        type: "landing_page",
        uid: "get-certified",
    },
    {
        type: "landing_page",
        uid: "exclusive-access-june-2023",
    },
    {
        type: "header",
    },
    {
        type: "footer",
    },
]

// Repositories we want to replicate the models from the main repository to.
const SUB_REPOSITORIES = [
    {
        repoName: "slicify-v3-adriana",
        token: process.env.ADRIANA_WRITE_TOKEN
    },
    {
        repoName: "slicify-v3-alexm",
        token: process.env.ALEXM_WRITE_TOKEN
    },
    {
        repoName: "slicify-v3-andrea",
        token: process.env.ANDREA_WRITE_TOKEN
    },
    {
        repoName: "slicify-v3-brenda",
        token: process.env.BRENDA_WRITE_TOKEN
    },
    {
        repoName: "slicify-v3-lea",
        token: process.env.LEA_WRITE_TOKEN
    },
    {
        repoName: "slicify-v3-maya",
        token: process.env.MAYA_WRITE_TOKEN
    },
    {
        repoName: "slicify-v3-michael",
        token: process.env.MICHAEL_WRITE_TOKEN
    },
    {
        repoName: "slicify-v3-nathan",
        token: process.env.NATHAN_WRITE_TOKEN
    },
    {
        repoName: "slicify-v3-nathanael",
        token: process.env.NATHANAEL_WRITE_TOKEN
    },
    {
        repoName: "slicify-v3-noor",
        token: process.env.NOOR_WRITE_TOKEN
    },
    {
        repoName: "slicify-v3-samira",
        token: process.env.SAMIRA_WRITE_TOKEN
    },
    {
        repoName: "slicify-v3-sarah",
        token: process.env.SARAH_WRITE_TOKEN
    },
    {
        repoName: "slicify-v3-thomas",
        token: process.env.THOMAS_WRITE_TOKEN
    },
]

const updateContent = async (template: any, child: any) => {

    // Prismic setup
    const writeClient = prismic.createWriteClient(child.repoName, {
        writeToken: child.token,
    });

    const migration = prismic.createMigration();

    // Fetch from template

    const client = prismic.createClient("slicify-v3-template");
    const documentFromTemplate = template.uid ?
        await client.getByUID(template.type, template.uid)
        : await client.getSingle(template.type);

    console.log(documentFromTemplate)
    // Update document in sub-repo
    const documentToUpdate = template.uid ?
        await writeClient.getByUID(template.type, template.uid)
        : await writeClient.getSingle(template.type);

    const document = migration.updateDocument(documentFromTemplate);

    // Execute the prepared migration at the very end of the script
    await writeClient.migrate(migration, {
        reporter: (event) => console.log(event),
    });
}


const bulkUpdate = () => {
    pagesToUpdate.forEach(page => {
        console.log("UPDATING PAGE", page)
        updateContent(page, SUB_REPOSITORIES[7])
    });
}

bulkUpdate();