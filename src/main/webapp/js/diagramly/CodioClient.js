/**
 * Copyright (c)
 * Copyright (c)
 */
CodioClient = function (editorUi)
{
    DrawioClient.call(this, editorUi, 'codioauth');
    this.subscribeCodio();
};

mxUtils.extend(CodioClient, DrawioClient);

CodioClient.prototype.extension = '.drawio'; //TODO export to png

CodioClient.prototype.getLibrary = function(id, success, error)
{
    this.getFile(id, success, error, false, true);
};

CodioClient.prototype.saveFile = function(file, success, error)
{
    // save in current file
    var filename = window.codio.getFileName();
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
                    saveSuccess(resp);
                })
                .catch(function(e)
                {
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
	this.insertFile(filename, data, success, error, true, folderId, false);
};

CodioClient.prototype.insertFile = function(filename, data, success, error)
{
    var meta = {'name': filename, isNew: true};
    success(new CodioFile(this.ui, data, meta));
};

CodioClient.prototype.getFileName = function()
{
    return window.codio.getFileName().replace('.drawio', '');
};

CodioClient.prototype.subscribeCodio = function()
{
    window.codio.loaded().then(mxUtils.bind(this, function()
    {
        window.codio.subscribeProjectUpdate(mxUtils.bind(this, function(data)
        {
            var currentFile = this.ui.getCurrentFile();
            var fileName = currentFile.getTitle();

            if (data.fileMoved && fileName == data.from)
            {
                currentFile.setTitle(data.to);
                currentFile.descriptorChanged();
            }
        }));
    }));
};

CodioClient.prototype.unsubscribe = function()
{
    window.codio.unsubscribeProjectUpdate();
};