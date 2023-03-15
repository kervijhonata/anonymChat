function closeDialog(e) {

    try {
        let btnClose = e
        let dialogName = e.dataset.dialogClose
    
        if(btnClose && dialogName) {
            let dialog = document.querySelector(`[data-dialog-name="${dialogName}"]`)
            dialog.close()
            return
        }
    }
    catch(err) {
        console.log(`closeDialog(err): ${err}`)
    }

}