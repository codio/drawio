CodioFile = function(ui, data, meta)
{
    DrawioFile.call(this, ui, data);
    this.meta = meta;
}

mxUtils.extend(CodioFile, DrawioFile);

CodioFile.prototype.autosaveDelay = 500;

CodioFile.prototype.isRealtimeSUppoorted = function()
{
    return true;
};

CodioFile.prototype.getId = function()
{
    return this.getIdOf(this.meta);
};

CodioFile.prototype.getParentId = function()
{
    return this.getIdOf(this.meta, true);
};

CodioFile.prototype.getIdOf = function(itemObj, parent)
{
    // todo: codio. do need this?
    return 'parentId';
};

CodioFile.prototype.getHash = function()
{
    return 'C' + encodeURIComponent(this.getId());
};

CodioFile.prototype.getMode = function()
{
    return App.MODE_CODIO;
};

CodioFile.prototype.isAutosaveOptional = function()
{
    return true;
};

CodioFile.prototype.getTitle = function()
{
    return this.meta.name;
};

CodioFile.prototype.isRenamable = function()
{
    return true;
};

CodioFile.prototype.getSize = function()
{
    return this.meta.size;
};

CodioFile.prototype.isConflict = function(req)
{
    // todo: codio. check if window codio not working?
    return req != null;
};

CodioFile.prototype.getDescriptor = function()
{
    return this.meta;
};

CodioFile.prototype.setDescriptor = function(desc)
{
    return this.meta = desc;
};

CodioFile.prototype.save = function(revision, success, error)
{

};

CodioFile.prototype.doSave = function(title, revision, success, error, unloading, overwrite)
{
    var prev = this.meta.name;
    this.meta.name = title;

    DrawioFile.prototype.save.apply(this, [null, mxUtils.bind(this, function()
    {
        this.meta.name = prev;
        this.saveFile(title, revision, success, error, unloading, overwrite);
    }), error, unloading, overwrite]);
};

CodioFile.prototype.saveFile = function(title, revision, success, error, unloading, overwrite)
{
    if (!this.isEditable())
    {
        if (success != null) {
            success();
        }
    }
    else if (!this.savingFile)
    {
        if (this.getTitle() == title)
        {
            var doSave = mxUtils.bind(this, function()
            {
                this.savingFile = true;

                this.ui.codio.saveFile(this, mxUtils.bind(this, function(meta, savedData)
                {
                    this.savingFile = false;
                    this.meta = meta;

                    if (success != null)
                    {
                        success();
                    }
                }), mxUtils.bind(this, function(err, req)
                {
                    this.savingFile = false;
                    if (error != null)
                    {
                        error(err);
                    }
                })
                );
            });

            doSave();
        }
        else
        {
            this.savingFileTime = new Date();
            this.savingFile = true;

            // todo: codio. no title
            console.log('save without title');
            this.savingFile = false;
        }
    }
};

CodioFile.prototype.getFile = function(id, success, error)
{
    this.ui.codio.getFile(id, success, error);
};