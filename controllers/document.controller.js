const documentService = require('../services/document.service');
const fs = require('fs');

class DocumentController {

  async upload(req, res) {
    try {
      
      
      const documentData = {
        originalName:req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        uploadedBy: req.user.id
      };
      //console.log(req.file)
      
      const document = await documentService.createDocument(documentData);
      
      res.status(201).json({
        message: 'Document uploadé avec succès',
        document
      });
      
    } catch (error) {
      console.error(' Erreur upload:', error);
      

      
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({ 
        error: error.message 
      });
    }
  }

    async getAllDocuments(req, res) {
    try {
      const documents = await documentService.getAllDocuments();

    if (documents.length === 0) {

      return res.status(200).json({ message: "Aucun document trouvé" });
    }
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  // Mes documents

    async getMyDocuments(req, res) {
    try {
      const documents = await documentService.getMyDocuments(req.user.id);
      

      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //  document By id 
  async getById(req, res) {
    try {
      const { id } = req.params;
      const document = await documentService.getDocumentById(id);
      
      if (!document) {
        return res.status(404).json({ error: 'Document introuvable' });
      }
      
      res.json(document);
    } catch (error) {

      res.status(500).json({  error: error.message });
    }
  }



  //  DELETE 
async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Récupérer le document
      const document = await documentService.getDocumentById(id);
      
      if (!document) {
        return res.status(404).json({  error: 'Document introuvable' });
      }

      
      // Supprimer
      await documentService.deleteDocument(id);
      
      res.json({ 
        message: 'Document supprimé avec succès' 
      });
      
    } catch (error) {
      
      res.status(500).json({ error: error.message });
    }
  }



}
module.exports = new DocumentController();