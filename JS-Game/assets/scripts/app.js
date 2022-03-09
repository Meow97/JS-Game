const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 27;
const HEAL_VALUE = 20;
const EVENT_LOG_PLAYER_ATTACK = "PLAYER_ATTACK";
const EVENT_LOG_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const EVENT_LOG_MONSTER_ATTACK = "MONSTER_ATTACK";
const EVENT_LOG_PLAYER_HEAL = "PLAYER_HEAL";
const EVENT_LOG_GAME_OVER = "GAME_OVER";

const enteredValue = prompt("Introduce your indicator of lives", "100");

let chosenMaxLife = parseInt(enteredValue);
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let mode;
let bonusLife = true;
let battleLog = [];

function writelog(ev, value, monsterHealth, playerHeaalth) {
  logEntry = {
    event: ev,
    value: value,
    monsterHealth: monsterHealth,
    playerHeaalth: playerHeaalth,
    time: new Date(),
  };
  if (ev === EVENT_LOG_PLAYER_ATTACK) {
    logEntry.target = "MONSTER";
  } else if (ev === EVENT_LOG_PLAYER_STRONG_ATTACK) {
    logEntry.targer = "MONSTER";
  } else if (ev === EVENT_LOG_MONSTER_ATTACK) {
    logEntry.target = "PLAYER";
  } else if (ev === EVENT_LOG_PLAYER_HEAL) {
    logEntry.target = "PLAYER";
  }
  battleLog.push(logEntry);
}

adjustHealthBars(chosenMaxLife);

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  addBonusLife();
  bonusLife = true;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writelog(
    EVENT_LOG_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && bonusLife) {
    bonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("You would be dead but the bonus life saved you!");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You win!");
    writelog(
      EVENT_LOG_GAME_OVER,
      "PLAYER WIN",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("Monster win!");
    writelog(
      EVENT_LOG_GAME_OVER,
      "MONSTER_WIN",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert("Draw");
    writelog(
      EVENT_LOG_GAME_OVER,
      "DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attack(mode) {
  const maxDamage =
    mode === "simple_attack" ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    mode === "simple_attack"
      ? EVENT_LOG_PLAYER_ATTACK
      : EVENT_LOG_PLAYER_STRONG_ATTACK;

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writelog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  mode = "simple_attack";
  attack(mode);
}

function strongAttackHandler() {
  mode = "strong_attack";
  attack(mode);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert(`You don't have possiblity to heal more than your max life value`);
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writelog(
    EVENT_LOG_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  console.log(battleLog);
  battleLog = [];
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
