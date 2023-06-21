/* global Phaser */

// Copyright (c) 2020 Mr. Coxall All rights reserved
//
// Created by: Tim Brady, Ryan Duffett
// Created on: May 2023
// This is the Game Scene

class GameScene extends Phaser.Scene {
  // create a car
  createCar() {
    let carYLocation = Math.floor(Math.random() * 3) + 1 // this will get a number between 1 and 5
    if (carYLocation == 1) {
      carYLocation = 400
    } else if (carYLocation == 2) {
      carYLocation = 600
    } else if (carYLocation == 3) {
      carYLocation = 800
    }
    const aCar = this.physics.add.sprite(-100, carYLocation, "car")
    aCar.body.velocity.y = 0
    aCar.body.velocity.x = carYLocation
    this.carGroup.add(aCar)
  }

  constructor() {
    super({ key: "gameScene" })

    this.background = null
    this.dominik = null
    this.score = 0
    this.scoreText = null
    this.scoreTextStyle = {
      font: "65px Arial",
      fill: "#ffffff",
      align: "center",
    }
    this.gameOverTextStyle = {
      font: "65px Arial",
      fill: "#ff0000",
      align: "center",
    }
  }

  init(data) {
    this.cameras.main.setBackgroundColor("#0x5f6e7a")
  }

  preload() {
    console.log("Game Scene")

    // images
    this.load.image("roadBackground", "assets/background.png")
    this.load.image("dominik", "assets/dominik.png")
    this.load.image("car", "assets/game_car.png")
    this.load.image("greek", "assets/greek.png")
    // sound
    this.load.audio("bomb", "assets/bomb.wav")
  }

  create(data) {
    this.background = this.add.image(0, 0, "roadBackground").setScale(1.0)
    this.background.setOrigin(0, 0)

    this.scoreText = this.add.text(
      10,
      10,
      "Score: " + this.score.toString(),
      this.scoreTextStyle
    )

    this.dominik = this.physics.add.sprite(1920 / 2, 1080 - 100, "dominik")

    this.greek = this.physics.add.sprite(1920 / 2, 1080 - 890, "greek")

    // create a group for the cars
    this.carGroup = this.add.group()
    this.createCar()
    this.createCar()

    // Collisions between dom and greek on wheels to add a point to the total score
    this.physics.add.collider(
      this.dominik,
      this.greek,
      function (dominikCollide) {
        dominikCollide.y = 980
        dominikCollide.x = 960
        this.score = this.score + 1
        this.scoreText.setText("Score: " + this.score.toString())
        this.createCar()
      }.bind(this)
    )


    // Collisions between dom and cars
    this.physics.add.collider(
      this.dominik,
      this.carGroup,
      function (dominikCollide, carCollide) {
        this.sound.play("bomb")
        this.physics.pause()
        carCollide.destroy()
        dominikCollide.destroy()
        this.score = 0
        this.gameOverText = this.add
          .text(
            1920 / 2,
            1080 / 2,
            "Game Over!\nClick to play again!",
            this.gameOverTextStyle
          )
          .setOrigin(0.5)
        this.gameOverText.setInteractive({ useHandCursor: true })
        this.gameOverText.on("pointerdown", () =>
          this.scene.start("gameScene")
        )
      }.bind(this)
    )
  }

  update(time, delta) {
    // called 60 times a second

    const keyLeftObj = this.input.keyboard.addKey("LEFT")
    const keyRightObj = this.input.keyboard.addKey("RIGHT")
    const keyAObj = this.input.keyboard.addKey("A")
    const keyDObj = this.input.keyboard.addKey("D")
    const keyUpObj = this.input.keyboard.addKey("UP")
    const keyDownObj = this.input.keyboard.addKey("DOWN")
    const keyWObj = this.input.keyboard.addKey("W")
    const keySObj = this.input.keyboard.addKey("S")

    if (keyLeftObj.isDown || keyAObj.isDown === true) {
      this.dominik.x -= 4
      if (this.dominik.x < 0) {
        this.dominik.x = 1920
      }
    }

    if (keyRightObj.isDown || keyDObj.isDown === true) {
      this.dominik.x += 4
      if (this.dominik.x > 1920) {
        this.dominik.x = 0
      }
    }

    if (keyUpObj.isDown || keyWObj.isDown === true) {
      this.dominik.y -= 4
      if (this.dominik.y > 1920) {
        this.dominik.y = 0
      }
    }

    if (keyDownObj.isDown || keySObj.isDown === true) {
      this.dominik.y += 4
      if (this.dominik.y > 1920) {
        this.dominik.y = 0
      }
    }
    this.carGroup.children.each(function (item) {
      if (item.x > 2000) {
        item.x = 0
      }
    })
  }
}

export default GameScene
