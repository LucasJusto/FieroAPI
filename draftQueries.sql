--todos os times de challenges em andamento onde o usuario eh o dono e tem mais de um usuario (online)
SELECT *
FROM team 
INNER JOIN quick_challenge 
    ON ("quickChallenge_id" = quick_challenge.id)
WHERE quick_challenge."alreadyBegin" = true
    AND
        quick_challenge.finished = false
    AND 
        team.owner_id = 'd15cda7f-e619-4281-a07c-a848edc0213b'
    AND (
        SELECT COUNT(*) 
        FROM team_user
            WHERE team_id = team.id
    ) > 1;

SELECT *
FROM quick_challenge
WHERE quick_challenge.owner_id = '3f56ab1f-0174-495e-ab9b-3d0e40efa963';

SELECT * 
FROM team;

SELECT * 
FROM team_user;

SELECT * 
FROM team_user
WHERE id = 'ffe329b0-af5e-4af4-ae51-dae96669cd3f';

--deletar os quickChallenges do dono que esta sendo excluido
DELETE
FROM quick_challenge
WHERE quick_challenge.owner_id = '5023bb59-c2bc-4620-b63a-bcdfa6e63672';

