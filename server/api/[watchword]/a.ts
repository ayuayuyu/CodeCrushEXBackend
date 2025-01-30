import { statusData } from "~/utils/updateStatus";
export default defineEventHandler(async (event) => {
    const stmt = db.prepare("SELECT * FROM watchwords");
    const stmt1 = db.prepare("SELECT * FROM codeAnswers")
    const watchwords= stmt.all();
    const codeAnswers  = stmt1.all();
    return {watchwords,codeAnswers,statusData}
})