CodioFile = function(ui, data, meta)
{
    DrawioFile.call(this, ui, data);
    
    this.meta = meta;
    this.peer = this.ui.codio;
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

CodioFile.prototype.getDescriptorEtag = function(desc)
{
	return desc.sha;
};

CodioFile.prototype.setDescriptorEtag = function(desc, etag)
{
	desc.sha = etag;
};

CodioFile.prototype.save = function(revision, success, error, unloading, overwrite)
{
    console.trace('codio file save revision, success, error', revision, success, error);
    DrawioFile.prototype.save.apply(this, [revision, mxUtils.bind(this, function()
    {
        this.saveFile(null, revision, success, error, unloading, overwrite);
    }), error, unloading, overwrite]);
};

CodioFile.prototype.saveAs = function(title, success, error)
{
	this.doSave(title, success, error);
};

CodioFile.prototype.doSave = function(title, revision, success, error, unloading, overwrite)
{
    console.trace('codio file doSave title, revision, success, error, unloading, overwrite', title, revision, success, error, unloading, overwrite);
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
    console.log('codio file saveFile title, revision, success, error, unloading, overwrite', title, revision, success, error, unloading, overwrite);
    if (!this.isEditable())
    {
        if (success != null) {
            success();
        }
    }
    else if (!this.savingFile)
    {
        var doSave = mxUtils.bind(this, function()
        {
            console.log('codio file do save');
            // Sets shadow modified state during save
            this.savingFileTime = new Date();
            this.setShadowModified(false);
            this.savingFile = true;

            var savedEtag = this.getCurrentEtag();
            var savedData = this.data;

            this.peer.saveFile(this, mxUtils.bind(this, function(etag)
            {
                // Checks for changes during save
                this.setModified(this.getShadowModified());
                this.savingFile = false;
                this.setDescriptorEtag(this.meta, etag);

                this.fileSaved(savedData, savedEtag, mxUtils.bind(this, function()
                {
                    this.contentChanged();
                    
                    if (success != null)
                    {
                        success();
                    }
                }), error);
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
};

CodioFile.prototype.getFile = function(id, success, error)
{
    this.ui.codio.getFile(id, success, error);
};