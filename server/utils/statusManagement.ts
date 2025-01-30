interface statusManage{
    [watchword : string]:{
        player1: string,
        player2: string,
    }
}
export const statusManagement: statusManage = {}; // グローバルで管理