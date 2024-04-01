/**
 * Copyright (c)
 * Copyright (c)
 */
CodioClient = function (editorUi)
{
    DrawioClient.call(this, editorUi, 'codioauth');
};

mxUtils.extend(CodioClient, DrawioClient);

CodioClient.prototype.getLibrary = function(id, success, error)
{
    this.getFile(id, success, error, false, true);
};

CodioClient.prototype.saveFile = function(file, success, error)
{
    // save in current file
    var filename = window.codio.getFileName();
    console.log('save file filename', filename);
    try
    {
        var savedData = file.getData();
        
        var fn = mxUtils.bind(this, function(data)
        {
            var saveSuccess = mxUtils.bind(this, function(resp)
            {
                success(resp, savedData);
            });

            window.codio.saveFile(filename, data)
                .then(function(resp)
                {
                    console.log('save file success', resp);
                    saveSuccess(resp);
                })
                .catch(function(e)
                {
                    console.log('save file error', e);
                    error(e);
                });
        });

        fn(savedData);
    }
    catch (e)
    {
        error (e);
    }
};

CodioClient.prototype.writeFile = function(filename, data, cardId, success, error)
{

};

CodioClient.prototype.pickLibrary = function(fn)
{
    this.pickFile(fn);
};

CodioClient.prototype.pickFolder = function(fn)
{
    // todo: codio what is this?
};

CodioClient.prototype.pickFile = function(fn, returnObject)
{
    fn = (fn != null) ? fn : mxUils.bind(this, function(id)
    {
        // todo: codio what to do ?
        this.ui.loadFile('C' + encodeURIComponent(id))
    });
};

CodioClient.prototype.getFile = function(id, success, error)
{
    var filename = window.codio.getFileName();
    console.trace('codioclient getFIle', success, error, 'filename', filename);

    window.codio.getFile(filename)
    .then(mxUtils.bind(this, function(item)
    {
        var meta = {'name': filename, isNew: true};
        if (item.content === '') {
            item.content = this.ui.emptyDiagramXml;
        }
        var fileObj = new CodioFile(this.ui, item.content, meta);
        success(fileObj);
    }))
    .catch(function(e)
    {
        if (error != null)
        {
            error(e);
        }
    });
};

CodioClient.prototype.insertLibrary = function(filename, data, success, error, folderId)
{
    console.log('codio client insertLibrary filename, data, success, error, folderId', filename, data, success, error, folderId);
	this.insertFile(filename, data, success, error, true, folderId, false);
};

CodioClient.prototype.insertFile = function(filename, data, success, error)
{
    console.log('codio client insertFile filename, data, success, error', filename, data, success, error);
    var meta = {'name': filename, isNew: true};
    success(new CodioFile(this.ui, data, meta));
};
