/* global Phaser */

// Copyright (c) 2020 Mr. Coxall All rights reserved
//
// Created by: Tim Brady
// Created on: May 2023
// This is the Game Scene

class GameScene extends Phaser.Scene {
  // create an alien
  createAlien() {
    const alienYLocation = Math.floor(Math.random() * 1080) + 1 // this will get a number between 1 and 1920
    let alienYVelocity = Math.floor(Math.random() * 500) + 200 // this will get a number between 1 and 50
    const anAlien = this.physics.add.sprite(-100, alienYLocation, "alien")
    anAlien.body.velocity.y = 0
    anAlien.body.velocity.x = alienYVelocity
    this.alienGroup.add(anAlien)
  }

  constructor() {
    super({ key: "gameScene" })

    this.background = null
    this.ship = null
    this.fireMissile = false
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
    this.load.image("starBackground", "assets/background.png")
    this.load.image("ship", "assets/spaceShip.png")
    this.load.image("missile", "assets/missile.png")
    this.load.image("alien", "assets/game_car.png")
    // sound
    this.load.audio("laser", "assets/laser1.wav")
    this.load.audio("explosion", "assets/barrelExploding.wav")
    this.load.audio("bomb", "assets/bomb.wav")
  }

  create(data) {
    this.background = this.add.image(0, 0, "starBackground").setScale(1.0)
    this.background.setOrigin(0, 0)

    this.scoreText = this.add.text(
      10,
      10,
      "Score: " + this.score.toString(),
      this.scoreTextStyle
    )

    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, "ship")

    // create a group for the missiles
    this.missileGroup = this.physics.add.group()

    // create a group for the aliens
    this.alienGroup = this.add.group()
    this.createAlien()

    // Collisions between missiles and aliens
    this.physics.add.collider(
      this.missileGroup,
      this.alienGroup,
      function (missileCollide, alienCollide) {
        alienCollide.destroy()
        missileCollide.destroy()
        this.sound.play("explosion")
        this.score = this.score + 1
        this.scoreText.setText("Score: " + this.score.toString())
        this.createAlien()
        this.createAlien()
      }.bind(this)
    )

    // Collisions between ship and aliens
    this.physics.add.collider(
      this.ship,
      this.alienGroup,
      function (shipCollide, alienCollide) {
        this.sound.play("bomb")
        this.physics.pause()
        alienCollide.destroy()
        shipCollide.destroy()
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
    // called 60 times a second, hopefully!

    const keyLeftObj = this.input.keyboard.addKey("LEFT")
    const keyRightObj = this.input.keyboard.addKey("RIGHT")
    const keyAObj = this.input.keyboard.addKey("A")
    const keyDObj = this.input.keyboard.addKey("D")
    const keyUpObj = this.input.keyboard.addKey("UP")
    const keyDownObj = this.input.keyboard.addKey("DOWN")
    const keyWObj = this.input.keyboard.addKey("W")
    const keySObj = this.input.keyboard.addKey("S")

    if (keyLeftObj.isDown || keyAObj.isDown === true) {
      this.ship.x -= 4
      if (this.ship.x < 0) {
        this.ship.x = 1920
      }
    }

    if (keyRightObj.isDown || keyDObj.isDown === true) {
      this.ship.x += 4
      if (this.ship.x > 1920) {
        this.ship.x = 0
      }
    }

    if (keyUpObj.isDown || keyWObj.isDown === true) {
      this.ship.y -= 4
      if (this.ship.y > 1920) {
        this.ship.y = 0
      }
    }

    if (keyDownObj.isDown || keySObj.isDown === true) {
      this.ship.y += 4
      if (this.ship.y > 1920) {
        this.ship.y = 0
      }
    }
    this.alienGroup.children.each(function (item) {
      if (item.x > 2000) {
        item.x = 200
      }
    })
  }
}

export default GameScene
