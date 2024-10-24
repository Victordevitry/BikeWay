const express = require('express');
const BikeRoute = require('../models/bike-route'); 

const router = express.Router();

router.post('/save', async (req, res) => {
  try {
    const { origin, destination, userEmail } = req.body;

    // Enregistrez l'itinéraire dans la base de données
    const route = await BikeRoute.create({ userEmail, origin, destination });

    res.status(200).send(route);
  } catch (err) {
    res.status(500).send({ message: 'Erreur lors de l\'enregistrement' });
  }
});

router.get('/:userEmail', async (req, res) => {
    const { userEmail } = req.params;
    
    try {
      const routes = await BikeRoute.find({ userEmail });
      res.status(200).send(routes);
    } catch (err) {
      res.status(500).send({ message: 'Erreur lors de la récupération des itinéraires' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const routeId = req.params.id;
  
    try {
      await BikeRoute.findByIdAndDelete(routeId);
      res.status(200).send({ message: 'Itinéraire supprimé avec succès' });
    } catch (error) {
      res.status(500).send({ message: 'Erreur lors de la suppression', error });
    }
  });
  
module.exports = router;
