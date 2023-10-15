// Description: Node Express REST API with Sequelize and SQLite CRUD Book
// npm install express sequelize sqlite}
// Run this file with node SequlizeSQLiteCRUDBook. js
// Test with Postman

const express = require('express');
const Sequelize = require('sequelize');
const app = express();

// parse incoming requests
app. use (express. json());

// create a connection to the database
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './Database/StudioAndAnime.sqlite'
});
//Studio Animation----------------------------------------------------------------------------------------------------------
const StudioAnime = sequelize.define('sani', { //studio Anime
    id_sa: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    studioId: { // foreign key to Studio
        type: Sequelize.STRING,
        foreignKey: false
    },
    animeId: { // foreign key to Animation
        type: Sequelize.STRING,
        foreignKey: false
    },
}, {
    timestamps: false
});
//-----------------------------------------------------------------------------------------------------------------
//Studio----------------------------------------------------------------------------------------------------------
const Studio  = sequelize.define('studio', { //studio
    id_studio: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    studio: {
        type: Sequelize.STRING,
        allowNull: false
    }

});
//-----------------------------------------------------------------------------------------------------------------
// Animation------------------------------------------------------------------------------------------------------
const Animation  = sequelize.define('animation', { //Anime
    id_anime: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    anime: {
        type: Sequelize.STRING,
        allowNull: false
    }

});
//-----------------------------------------------------------------------------------------------------------------
StudioAnime.belongsTo(Studio, { foreignKey: 'studioId', as: 'belongsToStudio' });
StudioAnime.belongsTo(Animation, { foreignKey: 'animeId', as: 'belongsToAnimation' });

    // create the books table if it doesn't exist
    sequelize.sync();
//Studio Animation----------------------------------------------------------------------------------------------------------
// route to get all StudioAnimes
app.get('/sanis', (req, res) => {
    StudioAnime.findAll({
      include: [
        {
          model: Studio,
          as: 'belongsToStudio',
          attributes: ['studio'],
        },
        {
          model: Animation,
          as: 'belongsToAnimation',
          attributes: ['anime'],
        },
      ],
    })
      .then(sanis => {
        // Process the retrieved values here
        const formattedSanis = sanis.map(sani => {
          return {
            id_sa: sani.id_sa,
            studioId: sani.studioId,
            animeId: sani.animeId,
            studio: sani.belongsToStudio.studio,
            anime: sani.belongsToAnimation.anime,
          };
        });
        console.log(formattedSanis);
        res.json(formattedSanis); 
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });

  app.get('/sanis3', (req, res) => {
    StudioAnime.findAll({
      attributes: [
        'studioId',
        [sequelize.fn('GROUP_CONCAT', sequelize.col('belongsToAnimation.anime')), 'anime'],
      ],
      include: [
        {
          model: Studio,
          as: 'belongsToStudio',
          attributes: ['studio'],
        },
        {
          model: Animation,
          as: 'belongsToAnimation',
          attributes: [],
        },
      ],
      group: ['studioId', 'belongsToStudio.studio'], // Group by both studioId and studio
    })
      .then(sanis => {
        // Process the retrieved values here
        const formattedSanis = sanis.map(sani => ({
          studioId: sani.studioId,
          studio: sani.belongsToStudio.studio,
          anime: sani.getDataValue('anime'), // Get the grouped anime values
        }));
        console.log(formattedSanis);
        res.json(formattedSanis);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
  
  // route to get a StudioAnime by id
  app.get('/sanis/:id', (req, res) => {
    StudioAnime.findByPk(req.params.id, {
      include: [
        {
          model: Studio,
          as: 'belongsToStudio',
          attributes: ['studio'],
        },
        {
          model: Animation,
          as: 'belongsToAnimation',
          attributes: ['anime'],
        },
      ],
    })
      .then(sani => {
        if (!sani) {
          res.status(404).send('Studio Animation not found');
        } else {
          
          const formattedSani = {
            id_sa: sani.id_sa,
            studioId: sani.studioId,
            animeId: sani.animeId,
            studio: sani.belongsToStudio.studio,
            anime: sani.belongsToAnimation.anime,
  
          };
          res.json(formattedSani);
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
  
  // route to create a new StudioAnime
  app.post('/sanis', (req, res) => {
    StudioAnime.create(req.body)
      .then(sani => {
        res.send(sani);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
  
  // route to update a StudioAnime by id
  app.put('/sanis/:id', (req, res) => {
    StudioAnime.findByPk(req.params.id)
      .then(sani => {
        if (!sani) {
          res.status(404).send('Studio Animation not found');
        } else {
            sani.update(req.body)
            .then(updatedSa => {
              res.send(updatedSa);
            })
            .catch(err => {
              res.status(500).send(err);
            });
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
  
  // route to delete a StudioAnime by id
  app.delete('/sanis/:id', (req, res) => {
    StudioAnime.findByPk(req.params.id)
      .then(sani => {
        if (!sani) {
          res.status(404).send('Studio Animation not found');
        } else {
            sani.destroy()
            .then(() => {
              res.send({});
            })
            .catch(err => {
              res.status(500).send(err);
            });
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
//-----------------------------------------------------------------------------------------------------------------
//Studio----------------------------------------------------------------------------------------------------------
// route to get all studios
app.get('/studios', (req, res) =>{
    Studio. findAll().then(studios => {
            res. json(studios) ;
        }).catch(err => {
            res.status(500).send(err);
        });
    });
    
    // route to get a book by id
    app.get('/studios/:id', (req, res) => {
    Studio.findByPk(req.params.id).then(studio => {
    if (!studio) {
            res.status (404).send('Animation not found');
        } else {    
            res.json(studio) ;
        }
        }).catch(err => {
            res.status(500).send(err);
        });
    });
    
    // route to create a new book
    app.post('/studios', (req, res) => {
        Studio.create(req.body).then(studio => {
        res.send (studio)
        }).catch(err => {
        res.status(500).send(err);
        });
    });
        
        // route to update a book
    app.put('/studios/:id', (req, res) => {
        Studio.findByPk( req.params.id).then(studio => {
        if (!studio){
            res.status(404).send('Animation not found');
        } else {
            studio.update(req.body).then(() => {
            res.send(studio) ;
        }).catch(err => {
            res.status(500).send(err);
        });
        }
        }).catch(err => {
            res. status(500).send(err);
        });
    });
    
    // route to delete a book
    app.delete('/studios/:id', (req, res) => {
        Studio.findByPk(req.params.id).then(studio => {
        if (!studio) {
            res.status(404).send('Animation not found');
        } else {
            studio.destroy().then(() => {
            res.send({});
        }).catch(err => {
            res.status (500) .send(err);
        });
        }
        }).catch(err => {
        res.status(500).send(err);
        });
        });
// Animation------------------------------------------------------------------------------------------------------  animations
    // route to get all books
app.get('/animations', (req, res) =>{
Animation. findAll().then(animations => {
        res. json(animations) ;
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to get a book by id
app.get('/animations/:id', (req, res) => {
Animation.findByPk(req.params.id).then(animation => {
if (!animation) {
        res.status (404).send('Animation not found');
    } else {    
        res.json(animation) ;
    }
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to create a new book
app.post('/animations', (req, res) => {
    Animation.create(req.body).then(animation => {
    res.send (animation)
    }).catch(err => {
    res.status(500).send(err);
    });
});
    
    // route to update a book
app.put('/animations/:id', (req, res) => {
    Animation.findByPk( req.params.id).then(animation => {
    if (!animation) {
        res.status(404).send('Animation not found');
    } else {
    animation.update(req.body).then(() => {
        res.send(animation) ;
    }).catch(err => {
        res.status(500).send(err);
    });
    }
    }).catch(err => {
        res. status(500).send(err);
    });
});

// route to delete a book
app.delete('/animations/:id', (req, res) => {
    Animation.findByPk(req.params.id).then(animation => {
    if (!animation) {
        res.status(404).send('Animation not found');
    } else {
        animation.destroy().then(() => {
        res.send({});
    }).catch(err => {
        res.status (500) .send(err);
    });
    }
    }).catch(err => {
    res.status(500).send(err);
    });
    });



    // start the server
    const port = process.env.PORT || 3000;
    app. listen(port, () => console.log(`Listening on port ${port}...`));