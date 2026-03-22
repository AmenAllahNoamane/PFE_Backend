const {prisma} = require('../config/database');
const fs = require('fs').promises;

class DocumentService {



async createDocument(documentData) {
    
      const newDocument = await prisma.document.create({
        data: {
          ...documentData,
          statut: 'EN_COURS'
        },
        include: {
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
              role: true
            }
          }
        }
      });
      
      return newDocument;
    
  }

  async getAllDocuments() {
    
    // pour tester le chargement 
   // await new Promise(resolve => setTimeout(resolve, 5000));
      const documents = await prisma.document.findMany({
        include: {
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
              role: true,
             // fakeField: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return documents;
   
  }


  // Récupérer que mes documents . apes login 


    async getMyDocuments(userId) {
    
     // pour tester le chargement 
     // await new Promise(resolve => setTimeout(resolve, 5000));
      const documents = await prisma.document.findMany({
        where: {   uploadedBy: userId},
        include: {
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
              role: true,
              
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return documents;
    } 
  
  // document par id 

async getDocumentById(id) {
    
      const document = await prisma.document.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
              role: true
            }
          }
        }
      });
      
      return document;
    }

  // DELETE

async deleteDocument(id) {
    try {
      // Récupérer le document
      const document = await prisma.document.findUnique({
        where: { id }
      });
      
      
      
      // Supprimer le fichier physique
      try {
        await fs.unlink(document.filePath);
        console.log('Fichier physique supprimé:', document.filePath);
      } catch (error) {
        console.error('Erreur suppression fichier:', error.message);
      }
      
      // Supprimer de la BDD
      await prisma.document.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      throw new Error(`Erreur suppression document: ${error.message}`);
    }
  }












}
module.exports = new DocumentService();