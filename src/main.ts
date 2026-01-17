import Phaser from 'phaser';
import './style.css';

// --- 素材データ ---
const ASSETS = {
  grass: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjNGNhZjUwIi8+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjYiIGhlaWdodD0iNiIgZmlsbD0iIzNiOGUyZSIvPjxyZWN0IHg9IjEwIiB5PSIyMCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzNiOGUyZSIvPjxyZWN0IHg9IjQwIiB5PSI1MCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iIzNiOGUyZSIvPjxyZWN0IHg9IjUwIiB5PSIxMCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iIzNiOGUyZSIvPjwvc3ZnPg==',
  school: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3QgeD0iNCIgeT0iMjAiIHdpZHRoPSI1NiIgaGVpZ2h0PSI0MCIgZmlsbD0iIzhkNmU2MyIvPjxwYXRoIGQ9Ik0wIDIwIEwzMiAwIEw2NCAyMCBaIiBmaWxsPSIjNWQ0MDM3Ii8+PHJlY3QgeD0iMTIiIHk9IjMwIiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIGZpbGw9IiNiYmRlZmIiLz48cmVjdCB4PSIzMCIgeT0iMzAiIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgZmlsbD0iI2JiZGVmYiIvPjwvc3ZnPg==',
  teacher: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSI0OCI+PHJlY3QgeD0iOCIgeT0iMjAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIyMCIgZmlsbD0iIzFlODhlNSIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTIiIHI9IjgiIGZpbGw9IiNmZmNjYmMiLz48cmVjdCB4PSIxMCIgeT0iNDAiIHdpZHRoPSI0IiBoZWlnaHQ9IjgiIGZpbGw9IiMzMzMiLz48cmVjdCB4PSIxOCIgeT0iNDAiIHdpZHRoPSI0IiBoZWlnaHQ9IjgiIGZpbGw9IiMzMzMiLz48L3N2Zz4=',
  // 生徒（黒い制服）
  student: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSI0OCI+PHJlY3QgeD0iOCIgeT0iMjAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIyMCIgZmlsbD0iIzMzMzMzMyIvPjxMKciY2lyY2xlIGN4PSIxNiIgY3k9IjEyIiByPSI4IiBujZpbGw9IiNmZmNjYmMiLz48cmVjdCB4PSIxMCIgeT0iNDAiIHdpZHRoPSI0IiBoZWlnaHQ9IjgiIGZpbGw9IiMzMzMzMzMiLz48cmVjdCB4PSIxOCIgeT0iNDAiIHdpZHRoPSI0IiBoZWlnaHQ9IjgiIGZpbGw9IiMzMzMzMzMiLz48L3N2Zz4='
};

// --- 型定義 ---
interface TeacherData { x: number; y: number; }
interface SaveData {
  money: number; day: number; hour: number; minute: number;
  mapData: number[][]; teachers: TeacherData[];
}

// --- ボタン作成関数 ---
function createButton(scene: Phaser.Scene, x: number, y: number, label: string, callback: () => void, color: number = 0x004d40) {
  const container = scene.add.container(x, y);
  const width = 160; const height = 40;
  container.setSize(width, height);
  container.setInteractive({ useHandCursor: true });

  const bg = scene.add.rectangle(0, 0, width, height, color);
  bg.setStrokeStyle(2, 0xffffff);
  const text = scene.add.text(0, 0, label, { fontSize: '16px', color: '#ffffff', fontFamily: 'sans-serif' }).setOrigin(0.5);
  container.add([bg, text]);

  container.on('pointerdown', () => {
    scene.tweens.add({ targets: container, scale: { from: 0.95, to: 1 }, duration: 50, yoyo: true, onComplete: callback });
  });
  container.on('pointerover', () => bg.setFillStyle(color + 0x222222));
  container.on('pointerout', () => bg.setFillStyle(color));
  return container;
}

// --- 生徒クラス ---
class Student extends Phaser.GameObjects.Sprite {
  private targetBuilding: Phaser.GameObjects.Image | null = null;
  private speed: number = 0.08;

  constructor(scene: Phaser.Scene, x: number, y: number, target: Phaser.GameObjects.Image | null) {
    super(scene, x, y, 'student'); // 黒い制服の画像
    scene.add.existing(this);
    this.setOrigin(0.5, 1.0);
    this.targetBuilding = target;
    
    // 生徒は少し小さくする
    this.setScale(0.8);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.targetBuilding && this.targetBuilding.active) {
        // 校舎に向かって移動
        const tx = this.targetBuilding.x + 32; // 建物の中心へ
        const ty = this.targetBuilding.y + 32;
        
        const distance = Phaser.Math.Distance.Between(this.x, this.y, tx, ty);
        
        if (distance < 5) {
            // 到着！
            // イベントを発火して自分は消える
            this.emit('arrive');
            this.destroy();
        } else {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, tx, ty);
            this.x += Math.cos(angle) * this.speed * delta;
            this.y += Math.sin(angle) * this.speed * delta;
            
            // ピョコピョコ跳ねる
            this.y += Math.sin(time / 50) * 0.8;
            this.setDepth(this.y);
        }
    } else {
        // 目標がない場合は消える
        this.destroy();
    }
  }
}

// --- 先生クラス ---
class Teacher extends Phaser.GameObjects.Sprite {
  private moveTimer: number = 0; private targetX: number = 0; private targetY: number = 0;
  private mapWidth: number; private mapHeight: number; private tileSize: number;

  constructor(scene: Phaser.Scene, x: number, y: number, mapWidth: number, mapHeight: number, tileSize: number) {
    super(scene, x, y, 'teacher');
    this.scene = scene;
    this.mapWidth = mapWidth; this.mapHeight = mapHeight; this.tileSize = tileSize;
    scene.add.existing(this);
    this.setOrigin(0.5, 1.0);
    this.targetX = x; this.targetY = y;
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.targetX, this.targetY);
    if (distance < 2) {
      this.moveTimer -= delta;
      if (this.moveTimer <= 0) this.decideNextMove();
    } else {
      const speed = 0.06 * delta;
      const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetX, this.targetY);
      this.x += Math.cos(angle) * speed;
      this.y += Math.sin(angle) * speed;
      this.y += Math.sin(time / 100) * 0.5;
    }
    this.setDepth(this.y);
  }

  decideNextMove() {
    const gridX = Phaser.Math.Between(0, this.mapWidth - 1);
    const gridY = Phaser.Math.Between(0, this.mapHeight - 1);
    this.targetX = gridX * this.tileSize + (this.tileSize / 2);
    this.targetY = gridY * this.tileSize + (this.tileSize / 2);
    this.moveTimer = Phaser.Math.Between(2000, 5000);
  }
}

// --- タイトル画面 ---
class TitleScene extends Phaser.Scene {
  constructor() { super('TitleScene'); }
  create() {
    this.cameras.main.setBackgroundColor('#1a1a1a');
    this.add.text(640, 250, '青稜学園\n経営シミュレーション', {
      fontSize: '64px', color: '#4caf50', fontFamily: 'serif', align: 'center', stroke: '#ffffff', strokeThickness: 4
    }).setOrigin(0.5);

    const hasSave = localStorage.getItem('seiryo_save') !== null;
    const btnText = hasSave ? '続きから再開' : 'ゲームスタート';
    createButton(this, 640, 450, btnText, () => this.scene.start('GameScene'), 0x2e7d32);

    if (hasSave) {
      createButton(this, 640, 520, 'データを消して最初から', () => {
        localStorage.removeItem('seiryo_save');
        this.scene.restart();
      }, 0xc62828);
    }
    this.add.text(640, 680, '© 2026 Seiryo Game Project', { fontSize: '16px', color: '#666' }).setOrigin(0.5);
  }
}

// --- ゲーム本編 ---
class GameScene extends Phaser.Scene {
  private money: number = 1000000;
  private mapWidth: number = 30; private mapHeight: number = 20; private tileSize: number = 64;
  private mapData: number[][] = [];
  private teachers!: Phaser.GameObjects.Group;
  private buildings!: Phaser.GameObjects.Group;
  private students!: Phaser.GameObjects.Group; // 生徒グループ追加

  private day: number = 1; private hour: number = 8; private minute: number = 0; private timeTimer: number = 0;
  private spawnTimer: number = 0; // 生徒出現用タイマー

  private moneyText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private infoText!: Phaser.GameObjects.Text;

  constructor() { super('GameScene'); }

  preload() {
    this.load.image('grass', ASSETS.grass);
    this.load.image('school_building', ASSETS.school);
    this.load.image('teacher', ASSETS.teacher);
    
    // 生徒の画像を生成（黒い制服）
    const student = this.make.graphics({x:0, y:0});
    student.fillStyle(0x333333); // 黒い服
    student.fillRect(10, 20, 12, 20);
    student.fillStyle(0xffccbc); // 肌
    student.fillCircle(16, 12, 10);
    student.generateTexture('student', 32, 48);
  }

  create() {
    this.teachers = this.add.group({ runChildUpdate: true });
    this.buildings = this.add.group();
    this.students = this.add.group({ runChildUpdate: true });

    this.mapData = [];
    for (let y = 0; y < this.mapHeight; y++) {
      const row: number[] = [];
      for (let x = 0; x < this.mapWidth; x++) {
        row.push(0);
        const tile = this.add.image(x * this.tileSize, y * this.tileSize, 'grass');
        tile.setOrigin(0, 0); tile.setDepth(0);
      }
      this.mapData.push(row);
    }

    this.cameras.main.setBounds(0, 0, this.mapWidth * this.tileSize, this.mapHeight * this.tileSize);
    this.cameras.main.centerOn((this.mapWidth * this.tileSize) / 2, (this.mapHeight * this.tileSize) / 2);

    this.createUI();
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => this.handleInput(pointer));
    this.loadGame();
  }

  createUI() {
    const uiContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(9999);
    const timeBg = this.add.rectangle(1100, 30, 300, 40, 0x000000, 0.7);
    uiContainer.add(timeBg);
    this.timeText = this.add.text(1000, 15, '', { fontSize: '24px', color: '#ffffff', fontFamily: 'monospace' });
    uiContainer.add(this.timeText);

    this.moneyText = this.add.text(20, 20, '', { fontSize: '24px', color: '#ffffff', backgroundColor: '#000000', padding: { x: 10, y: 5 } });
    uiContainer.add(this.moneyText);
    this.updateMoneyText();

    const hireBtn = createButton(this, 100, 80, '先生を雇う', () => this.hireTeacher(), 0x004d40);
    uiContainer.add(hireBtn);
    const saveBtn = createButton(this, 280, 80, 'セーブする', () => this.saveGame(), 0x0277bd);
    uiContainer.add(saveBtn);

    this.infoText = this.add.text(640, 650, '生徒が登校し始めました', {
      fontSize: '20px', color: '#ffff00', backgroundColor: '#000000', padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    uiContainer.add(this.infoText);
  }

  saveGame() {
    const teacherData: TeacherData[] = [];
    this.teachers.getChildren().forEach((go) => {
      const t = go as Teacher; teacherData.push({ x: t.x, y: t.y });
    });
    const saveData: SaveData = {
      money: this.money, day: this.day, hour: this.hour, minute: this.minute,
      mapData: this.mapData, teachers: teacherData
    };
    localStorage.setItem('seiryo_save', JSON.stringify(saveData));
    this.showInfo('データを保存しました', '#00ff00');
  }

  loadGame() {
    const rawData = localStorage.getItem('seiryo_save');
    if (!rawData) return;
    const data: SaveData = JSON.parse(rawData);
    this.money = data.money; this.day = data.day; this.hour = data.hour; this.minute = data.minute;
    this.updateMoneyText(); this.updateTimeText();

    this.buildings.clear(true, true);
    this.mapData = data.mapData;
    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        if (this.mapData[y][x] === 1) {
          const building = this.add.image(x * this.tileSize, y * this.tileSize, 'school_building');
          building.setOrigin(0, 0); building.setDepth((y + 1) * this.tileSize);
          this.buildings.add(building);
        }
      }
    }
    this.teachers.clear(true, true);
    data.teachers.forEach(tData => {
      const teacher = new Teacher(this, tData.x, tData.y, this.mapWidth, this.mapHeight, this.tileSize);
      this.teachers.add(teacher);
    });
    this.showInfo('続きから再開しました', '#ffffff');
  }

  update(time: number, delta: number) {
    if (this.input.activePointer.isDown) {
      if (this.input.activePointer.prevPosition.x !== 0) {
        const scrollX = this.input.activePointer.position.x - this.input.activePointer.prevPosition.x;
        const scrollY = this.input.activePointer.position.y - this.input.activePointer.prevPosition.y;
        this.cameras.main.scrollX -= scrollX;
        this.cameras.main.scrollY -= scrollY;
      }
    }

    // 時間進行
    this.timeTimer += delta;
    if (this.timeTimer > 50) {
      this.timeTimer = 0; this.minute += 10;
      if (this.minute >= 60) {
        this.minute = 0; this.hour++;
        if (this.hour >= 24) {
          this.hour = 0; this.day++; this.dailySettlement();
        }
      }
      this.updateTimeText();
    }

    // 生徒出現処理 (朝7時から9時の間だけ出現)
    if (this.hour >= 7 && this.hour <= 9) {
        this.spawnTimer += delta;
        if (this.spawnTimer > 1000) { // 1秒に1人
            this.spawnStudent();
            this.spawnTimer = 0;
        }
    }
  }

  // 生徒を生み出す
  spawnStudent() {
    const buildings = this.buildings.getChildren();
    if (buildings.length === 0) return; // 校舎がなければ来ない

    // ランダムな校舎を目的地にする
    const target = buildings[Phaser.Math.Between(0, buildings.length - 1)] as Phaser.GameObjects.Image;
    
    // 画面の左端か下端から出現
    let startX = 0;
    let startY = 0;
    if (Math.random() > 0.5) {
        startX = Phaser.Math.Between(0, this.mapWidth * this.tileSize);
        startY = this.mapHeight * this.tileSize; // 下から
    } else {
        startX = 0; // 左から
        startY = Phaser.Math.Between(0, this.mapHeight * this.tileSize);
    }

    const student = new Student(this, startX, startY, target);
    this.students.add(student);

    // 校舎に着いた時の処理
    student.on('arrive', () => {
        this.earnTuition(student.x, student.y);
    });
  }

  // 学費ゲット！
  earnTuition(x: number, y: number) {
    const amount = 1000;
    this.money += amount;
    this.updateMoneyText();

    // ポップアップ演出
    const popText = this.add.text(x, y - 40, `+${amount}`, {
        fontSize: '20px',
        color: '#ffd700',
        stroke: '#000',
        strokeThickness: 3
    }).setOrigin(0.5);

    // ふわっと消える
    this.tweens.add({
        targets: popText,
        y: y - 80,
        alpha: 0,
        duration: 1000,
        onComplete: () => popText.destroy()
    });
  }

  dailySettlement() {
    // 先生の給料のみ計算（収入は生徒から直接もらうようになったので）
    const expense = this.teachers.getLength() * 10000;
    this.money -= expense;
    this.updateMoneyText();
    this.showInfo(`【決算】給料支払い:-${expense.toLocaleString()}円`, '#ff0000');
  }

  updateTimeText() {
    const hh = this.hour.toString().padStart(2, '0');
    const mm = this.minute.toString().padStart(2, '0');
    this.timeText.setText(`${this.day}日目 ${hh}:${mm}`);
  }
  updateMoneyText() { this.moneyText.setText(`資金: ${this.money.toLocaleString()}円`); }

  hireTeacher() {
    const cost = 500000;
    if (this.money < cost) { this.showInfo('資金が足りません！', '#ff0000'); return; }
    this.money -= cost;
    this.updateMoneyText();
    const centerX = (this.mapWidth * this.tileSize) / 2;
    const centerY = (this.mapHeight * this.tileSize) / 2;
    const newTeacher = new Teacher(this, centerX, centerY, this.mapWidth, this.mapHeight, this.tileSize);
    this.teachers.add(newTeacher);
    this.showInfo('先生を雇いました', '#00ff00');
  }

  placeBuilding(pointer: Phaser.Input.Pointer) {
    const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
    const mapX = Math.floor(worldPoint.x / this.tileSize);
    const mapY = Math.floor(worldPoint.y / this.tileSize);

    if (mapX < 0 || mapX >= this.mapWidth || mapY < 0 || mapY >= this.mapHeight) return;
    if (this.mapData[mapY][mapX] === 1) return;
    const cost = 100000;
    if (this.money < cost) { this.showInfo('資金不足です', '#ff0000'); return; }

    this.money -= cost;
    this.updateMoneyText();
    this.mapData[mapY][mapX] = 1;
    const building = this.add.image(mapX * this.tileSize, mapY * this.tileSize, 'school_building');
    building.setOrigin(0, 0); building.setDepth((mapY + 1) * this.tileSize);
    this.buildings.add(building);
    this.tweens.add({ targets: building, scaleY: { from: 0, to: 1 }, duration: 300, ease: 'Back.out' });
  }

  handleInput(pointer: Phaser.Input.Pointer) {
    if (pointer.position.y < 150) return;
    if (pointer.getDistance() < 10) this.placeBuilding(pointer);
  }
  showInfo(text: string, color: string) {
    this.infoText.setText(text); this.infoText.setColor(color);
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, width: 1280, height: 720, parent: 'app',
  backgroundColor: '#2d2d2d',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  pixelArt: true,
  scene: [TitleScene, GameScene]
};
new Phaser.Game(config);